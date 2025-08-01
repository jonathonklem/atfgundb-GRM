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

func GetRangeTrips(userId string) []models.RangeTrip {
	client := GetClient()

	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	filter := bson.D{{"user_id", userId}}

	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(100)

	// Here's an array in which you can store the decoded documents
	var results []models.RangeTrip = make([]models.RangeTrip, 0)

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := rangeTripsCollection.Find(context.Background(), filter, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	for cur.Next(context.Background()) {
		// create a value into which the single document can be decoded
		var elem models.RangeTrip
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.Background())
	return results

}

func GetAmmoReport(userId string, date_from string, date_to string) []models.AmmoReportEntry {
	client := GetClient()

	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	// example query
	/* [{
			$addFields: {
				cst_date: {$subtract: ["$date_done", 6*60*60*1000]},
			}
		},{
	       $match: {user_id: "google-oauth2|110522579750586824658", date_done: {$gte:  ISODate("2024-01-07"), $lt: ISODate("2024-02-10")} }
	   },{
	       $group: {
	           "_id": {
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
	           ammo_name: "$ammo.name",
	           count: "$count"
	       }
	   }]*/

	date_from_time, err := time.Parse("2006-01-02 15:04:05.000000", date_from+" 00:00:00.000000")

	if err != nil {
		log.Fatal(err)
	}
	date_to_time, err := time.Parse("2006-01-02 15:04:05.000000", date_to+" 23:59:59.000000")
	if err != nil {
		log.Fatal(err)
	}

	primitiveFrom := primitive.NewDateTimeFromTime(date_from_time)
	primitiveTo := primitive.NewDateTimeFromTime(date_to_time)

	results, err := rangeTripsCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$addFields", bson.D{{"cst_date", bson.D{{"$subtract", bson.A{"$date_done", 6*60*60*1000}}}}}}},
		bson.D{{"$match", bson.D{{"user_id", userId}, {"cst_date", bson.D{{"$gte", primitiveFrom}, {"$lte", primitiveTo}}}}}},
		bson.D{{"$group", bson.D{{"_id", bson.D{{"ammo_id", "$ammo_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$lookup", bson.D{{"from", "ammo"}, {"localField", "_id.ammo_id"}, {"foreignField", "_id"}, {"as", "ammo"}}}},
		bson.D{{"$project", bson.D{{"ammo_name", "$ammo.name"}, {"count", "$count"}}}},
	})

	var ammoReport []models.AmmoReportEntry = make([]models.AmmoReportEntry, 0)

	for results.Next(context.Background()) {
		var elem models.AmmoReportEntry
		err := results.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("ELEM FROM AMMO FETCH")
		log.Printf("Found result: %v", elem)
		ammoReport = append(ammoReport, elem)
	}

	results.Close(context.Background())

	return ammoReport
}

func GetGunReport(userId string, date_from string, date_to string) []models.GunReportEntry {
	client := GetClient()

	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	// example query
	/* [{
			$addFields: {
				cst_date: {$subtract: ["$date_done", 6*60*60*1000]},
			}
		},{
	       $match: {user_id: "google-oauth2|110522579750586824658", date_done: {$gte:  ISODate("2024-01-07"), $lt: ISODate("2024-02-10")} }
	   },{
	       $group: {
	           "_id": {
	               gun_id: "$gun_id"
	           },
	           count: {$sum: "$quantity_used"}
	       }
	   },{
	           $lookup: {
	               from: "guns",
	               localField: "_id.gun_id",
	               foreignField: "_id",
	               as: "gun"
	           }
	   }, {
	       $project: {
	           gun_name: "$gun.name",
	           count: "$count"
	       }
	   }]*/

	date_from_time, err := time.Parse("2006-01-02 15:04:05.000000", date_from+" 00:00:00.000000")

	if err != nil {
		log.Fatal(err)
	}
	date_to_time, err := time.Parse("2006-01-02 15:04:05.000000", date_to+" 23:59:59.000000")
	if err != nil {
		log.Fatal(err)
	}

	primitiveFrom := primitive.NewDateTimeFromTime(date_from_time)
	primitiveTo := primitive.NewDateTimeFromTime(date_to_time)

	results, err := rangeTripsCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$addFields", bson.D{{"cst_date", bson.D{{"$subtract", bson.A{"$date_done", 6*60*60*1000}}}}}}},
		bson.D{{"$match", bson.D{{"user_id", userId}, {"cst_date", bson.D{{"$gte", primitiveFrom}, {"$lte", primitiveTo}}}}}},
		bson.D{{"$group", bson.D{{"_id", bson.D{{"gun_id", "$gun_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$lookup", bson.D{{"from", "guns"}, {"localField", "_id.gun_id"}, {"foreignField", "_id"}, {"as", "gun"}}}},
		bson.D{{"$project", bson.D{{"gun_name", "$gun.name"}, {"count", "$count"}}}},
	})

	var gunReport []models.GunReportEntry = make([]models.GunReportEntry, 0)

	for results.Next(context.Background()) {
		log.Printf("Found result: %v", results.Current)
		var elem models.GunReportEntry
		err := results.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
		gunReport = append(gunReport, elem)
	}

	results.Close(context.Background())

	return gunReport
}

func GetDateAndAmmoReport(userId string, date_from string, date_to string) []models.DateAndAmmoReport {
	client := GetClient()

	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	// example query
	/* [{
		$addFields: {
			cst_date: {$subtract: ["$date_done", 6*60*60*1000]},
		}
	},{
		$match: {user_id: "google-oauth2|110522579750586824658", date_done: {$gte:  ISODate("2024-01-07"), $lt: ISODate("2024-01-10")} }
	},{
		$group: {
			"_id": {
				date_done: {$dateToString: { format: "%Y-%m-%dT00:53:00.48Z", date: "$date_done"}},
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
			ammo_name: "$ammo.name",
			date: {$dateFromString: {dateString: "$_id.date_done"}},
			count: "$count"
		}
	}]
	*/
	// convert date_done to time
	//convert date_done string to time object
	// give me the code now

	// doing the date conversion piecemeal because having one long bson.D entry was causing problems
	date_from_time, err := time.Parse("2006-01-02 15:04:05.000000", date_from+" 00:00:00.000000")	
	if err != nil {
		log.Fatal(err)
	}
	date_to_time, err := time.Parse("2006-01-02 15:04:05.000000", date_to+" 23:59:59.000000")
	if err != nil {
		log.Fatal(err)
	}

	primitiveFrom := primitive.NewDateTimeFromTime(date_from_time)
	primitiveTo := primitive.NewDateTimeFromTime(date_to_time)

	results, err := rangeTripsCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$addFields", bson.D{{"cst_date", bson.D{{"$subtract", bson.A{"$date_done", 6*60*60*1000}}}}}}},
		bson.D{{"$match", bson.D{{"user_id", userId}, {"cst_date", bson.D{{"$gte", primitiveFrom}, {"$lte", primitiveTo}}}}}},
		//bson.D{{"$group", bson.D{{"_id", bson.D{{"date_done", "$date_done"}, {"ammo_id", "$ammo_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$group", bson.D{{"_id", bson.D{{"date_done", bson.D{{"$dateToString", bson.D{{"format", "%Y-%m-%dT00:00:00.00Z"}, {"date", "$cst_date"}}}}}, {"ammo_id", "$ammo_id"}}}, {"count", bson.D{{"$sum", "$quantity_used"}}}}}},
		bson.D{{"$lookup", bson.D{{"from", "ammo"}, {"localField", "_id.ammo_id"}, {"foreignField", "_id"}, {"as", "ammo"}}}},
		bson.D{{"$project", bson.D{{"ammo_name", "$ammo.name"}, {"date", "$_id.date_done"}, {"count", "$count"}}}},
		bson.D{{"$sort", bson.D{{"date", 1}}}},
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
	client := GetClient()

	log.Println("NOT!!!  Loading america/chicago location time")

	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")

	rangeTrip.ID = primitive.NewObjectID()
	rangeTrip.DateDone = primitive.NewDateTimeFromTime(time.Now())

	log.Println("Sending the following time to mongo")
	log.Println(time.Now())

	log.Println("Right before updateone()")
	_, err := rangeTripsCollection.InsertOne(context.Background(), rangeTrip)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}

	// increase round count on gun based off quantity used and gun id
	gun := GetGunById(rangeTrip.GunId)
	gun.RoundCount += rangeTrip.QuantityUsed
	UpdateGun(gun)
}
