package db

import (
	"context"
	"log"
	"time"

	"atfgundb.com/app/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetDateAndAmmoReport(userId string, date_done string) []models.DateAndAmmoReport {
	client := getClient()

	log.Printf("userId: %v\ndate_done: %v", userId, date_done)

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()
	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	// example query
	/* [{
	$match: {user_id: "110522579750586824658", date_done: {$gt:  ISODate("2024-01-05")}}
		},{
			$group: {
				"_id": {
					date_done: "$date_done",
					ammo_id: "$ammo_id"
				},
				count: {$sum: "$quantity_used"}
			}
		},{
				$lookup: {
					from: "ammo",
					localField: "_id.ammo_id",
					foreignField: "_id",
					as: "ammo"
				}
		}, {
			$project: {
				ammo_name: "$ammo[0].name",
				date: "$_id.date_done",
				count: "$count"
			}
		}]
	*/
	// convert date_done to time
	//convert date_done string to time object
	// give me the code now

	// doing the date conversion piecemeal because having one long bson.D entry was causing problems
	// TODO WHY IS TIME.PARSE NOT WORKING
	date_done_time, err := time.Parse("2006-01-02 15:04:05.000000", date_done+" 00:00:00.000000")

	if err != nil {
		log.Fatal(err)
	}

	primitiveDateDone := primitive.NewDateTimeFromTime(date_done_time)

	results, err := rangeTripsCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$match", bson.D{{"user_id", userId}, {"date_done", bson.D{{"$gt", primitiveDateDone}}}}}},
		//bson.D{{"$group", bson.D{{"_id", bson.D{{"date_done", "$date_done"}, {"ammo_id", "$ammo_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$group", bson.D{{"_id", bson.D{{"date_done", bson.D{{"$dateToString", bson.D{{"format", "%Y-%m-%dT00:00:00.00Z"}, {"date", "$date_done"}}}}}, {"ammo_id", "$ammo_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$lookup", bson.D{{"from", "ammo"}, {"localField", "_id.ammo_id"}, {"foreignField", "_id"}, {"as", "ammo"}}}},
		bson.D{{"$project", bson.D{{"ammo_name", "$ammo.name"}, {"date", "$_id.date_done"}, {"count", "$count"}}}},
	})

	if err != nil {
		log.Fatal(err)
	}

	var dateAndAmmoReport []models.DateAndAmmoReport = make([]models.DateAndAmmoReport, 0)

	for results.Next(context.Background()) {
		log.Printf("Found result: %v", results.Current)
		var elem models.DateAndAmmoReport
		err := results.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
		dateAndAmmoReport = append(dateAndAmmoReport, elem)
	}

	results.Close(context.Background())

	return dateAndAmmoReport
}

func InsertRangeTrip(rangeTrip *models.RangeTrip) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()
	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")
	opts := options.Update().SetUpsert(true)

	rangeTrip.ID = primitive.NewObjectID()

	filter := bson.D{{"user_id", rangeTrip.UserId}, {"location", rangeTrip.Location}, {"ammo_id", rangeTrip.AmmoId}, {"gun_id", rangeTrip.GunId}, {"quantity_used", rangeTrip.QuantityUsed}}

	update := bson.D{
		{"$set", bson.D{{"date_done", primitive.NewDateTimeFromTime(time.Now())}}},
	}

	log.Println("Right before updateone()")
	_, err := rangeTripsCollection.UpdateOne(context.Background(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}

	// increase round count on gun based off quantity used and gun id
	gun := GetGunById(rangeTrip.GunId)
	gun.RoundCount += rangeTrip.QuantityUsed
	UpdateGun(gun)
}
