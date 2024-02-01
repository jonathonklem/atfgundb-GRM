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

func DeleteUser(userId string) {
	client := GetClient()

	// delete from users
	usersCollection := client.Database("ATFGunDB").Collection("users")

	filter := bson.D{{"id", userId}}

	log.Println("Right before deleteone()")
	_, err := usersCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		log.Println("Error deleting user collection")
		log.Fatal(err)
	}

	// delete from ammo collection
	ammoCollection := client.Database("ATFGunDB").Collection("ammo")
	filter = bson.D{{"user_id", userId}}

	log.Println("Right before DeleteMany()")
	// delete all ammo for this user
	_, err = ammoCollection.DeleteMany(context.Background(), filter)

	if err != nil {
		log.Println("Error deleting ammo collection")
		log.Fatal(err)
	}

	// delete from guns collection
	gunsCollection := client.Database("ATFGunDB").Collection("guns")
	filter = bson.D{{"user_id", userId}}
	log.Println("Right before DeleteMany()")
	// delete all guns for this user
	_, err = gunsCollection.DeleteMany(context.Background(), filter)

	if err != nil {
		log.Println("Error deleting guns collection")
		log.Fatal(err)
	}

	// delete all range trips for this user
	rangeTripsCollection := client.Database("ATFGunDB").Collection("rangetrips")
	filter = bson.D{{"user_id", userId}}
	log.Println("Right before DeleteMany()")
	_, err = rangeTripsCollection.DeleteMany(context.Background(), filter)


	if err != nil {
		log.Println("Error deleting range trips")
		log.Fatal(err)
	}

	// log the deletion
	deletionsCollection := client.Database("ATFGunDB").Collection("deletions")
	deletion := models.Deletion{DeletedDate: primitive.NewDateTimeFromTime(time.Now())}
	_, err = deletionsCollection.InsertOne(context.Background(), deletion)
}

func InsertUpdateUser(user *models.User) {
	client := GetClient()

	usersCollection := client.Database("ATFGunDB").Collection("users")
	opts := options.Update().SetUpsert(true)

	filter := bson.D{{"email", user.Email}, {"id", user.ID}, {"name", user.Name}}

	update := bson.D{
		{"$set", bson.D{{"lastlogin", primitive.NewDateTimeFromTime(time.Now())}}},
	}

	log.Println("Right before updateone()")
	_, err := usersCollection.UpdateOne(context.Background(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}
