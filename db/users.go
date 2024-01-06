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

func InsertUpdateUser(user *models.User) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()
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
