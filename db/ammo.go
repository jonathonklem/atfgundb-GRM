package db

import (
	"context"
	"fmt"
	"log"

	"atfgundb.com/app/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InsertAmmoPurchase(ammoPurchase *models.AmmoPurchase) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()

	ammoPurchaseCollection := client.Database("ATFGunDB").Collection("ammo_purchases")

	insertResult, err := ammoPurchaseCollection.InsertOne(context.Background(), ammoPurchase)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a single document: ", insertResult.InsertedID)

	// perform aggregate pipeline search to get total count of ammo matching ammo id and user id
	results, err := ammoPurchaseCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$match", bson.D{{"ammo_id", ammoPurchase.AmmoId}}}},
		bson.D{{"$group", bson.D{{"_id", "$ammo_id"}, {"totalAmount", bson.D{{"$sum", bson.D{{"$subtract", bson.A{"$quantity", "$quantityused"}}}}}}}}},
	})

	if err != nil {
		log.Fatal(err)
	}

	type MongoAggregateTotalAmount struct {
		ID          string `json:"_id"`
		TotalAmount int32  `json:"totalAmount"`
	}
	var totalAmountResults MongoAggregateTotalAmount

	for results.Next(context.Background()) {
		err := results.Decode(&totalAmountResults)
		if err != nil {
			log.Fatal(err)
		}
	}

	// perform aggregate pipeline search to get total count of ammo matching ammo id
	results, err = ammoPurchaseCollection.Aggregate(context.Background(), bson.A{
		bson.D{{"$match", bson.D{{"ammo_id", ammoPurchase.AmmoId}}}},
		bson.D{{"$group", bson.D{{"_id", "$price"}, {"totalAmount", bson.D{{"$sum", bson.D{{"$subtract", bson.A{"$quantity", "$quantityused"}}}}}}}}},
		bson.D{{"$addFields", bson.D{{"costContribution", bson.D{{"$multiply", bson.A{"$totalAmount", "$_id"}}}}}}},
		bson.D{{"$group", bson.D{{"_id", nil}, {"finalAmount", bson.D{{"$sum", "$totalAmount"}}}, {"totalCost", bson.D{{"$sum", "$costContribution"}}}}}},
		bson.D{{"$project", bson.D{{"averagePrice", bson.D{{"$divide", bson.A{"$totalCost", "$finalAmount"}}}}}}},
	})

	if err != nil {
		log.Fatal(err)
	}

	type MongoAggregateAveragePrice struct {
		ID           any     `json:"_id"`
		AveragePrice float64 `json:"averagePrice"`
	}
	var averagePriceResults MongoAggregateAveragePrice
	for results.Next(context.Background()) {
		err := results.Decode(&averagePriceResults)
		if err != nil {
			log.Fatal(err)
		}
	}

	// find the ammo document and update the count
	ammoCollection := client.Database("ATFGunDB").Collection("ammo")
	id, _ := primitive.ObjectIDFromHex(ammoPurchase.AmmoId)
	filter := bson.D{{"_id", id}}
	update := bson.D{{"$set", bson.D{{"count", totalAmountResults.TotalAmount}, {"last_price", ammoPurchase.Price}, {"average_price", averagePriceResults.AveragePrice}}}}

	_, err = ammoCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

}

func InsertUpdateAmmo(ammo *models.Ammo) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
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
	_, err := ammoCollection.UpdateOne(context.Background(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}

func GetAmmo(user *models.User) []models.Ammo {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
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
	cur, err := ammoCollection.Find(context.Background(), bson.D{{"user_id", user.ID}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.Background()) {

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
	cur.Close(context.Background())

	fmt.Printf("Found multiple documents (array of pointers): %+v\n", results)
	return results
}
