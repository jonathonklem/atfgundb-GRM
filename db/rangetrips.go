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
