package db

import (
	"context"
	"fmt"
	"log"

	"atfgundb.com/app/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InsertUpdateGun(gun *models.Gun) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	gunsCollection := client.Database("ATFGunDB").Collection("guns")
	opts := options.Update().SetUpsert(true)

	filter := bson.D{{"name", gun.Name}, {"manufacturer", gun.Manufacturer}, {"caliber", gun.Caliber}, {"model", gun.Model}, {"user_id", gun.UserID}}

	update := bson.D{
		{"$set", bson.D{{"roundcount", gun.RoundCount}}},
	}

	log.Println("Right before updateone()")
	_, err := gunsCollection.UpdateOne(context.TODO(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}

func GetGuns(user *models.User) []models.Gun {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(100)

	// Here's an array in which you can store the decoded documents
	var results []models.Gun = make([]models.Gun, 0)

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := gunsCollection.Find(context.TODO(), bson.D{{"user_id", user.ID}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.Gun
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("Found gun %s - %d\n", elem.Name, elem.RoundCount)
		results = append(results, elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	fmt.Printf("Found multiple documents (array of pointers): %+v\n", results)
	return results
}
