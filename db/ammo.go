package db

import (
	"context"
	"fmt"
	"log"

	"atfgundb.com/app/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InsertAmmoPurchase(ammoPurchase *models.AmmoPurchase) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	ammoPurchaseCollection := client.Database("ATFGunDB").Collection("ammo_purchases")

	insertResult, err := ammoPurchaseCollection.InsertOne(context.TODO(), ammoPurchase)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a single document: ", insertResult.InsertedID)
}

func InsertUpdateAmmo(ammo *models.Ammo) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	ammoCollection := client.Database("ATFGunDB").Collection("ammo")
	opts := options.Update().SetUpsert(true)

	filter := bson.D{{"name", ammo.Name}, {"caliber", ammo.Caliber}, {"grain", ammo.Grain}, {"user_id", ammo.UserID}}

	update := bson.D{
		{"$set", bson.D{{"count", 0}}},
	}

	log.Println("Right before updateone()")
	_, err := ammoCollection.UpdateOne(context.TODO(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}

func GetAmmo(user *models.User) []models.Ammo {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	ammoCollection := client.Database("ATFGunDB").Collection("ammo")

	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(100)

	// Here's an array in which you can store the decoded documents
	var results []models.Ammo = make([]models.Ammo, 0)

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := ammoCollection.Find(context.TODO(), bson.D{{"user_id", user.ID}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.Ammo
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("Found ammo %s - %d\n", elem.Name, elem.Count)
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
