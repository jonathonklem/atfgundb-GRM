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

func UpdateGun(gun models.Gun) {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	filter := bson.D{{"_id", gun.ID}}
	// pass all fields to be updated
	update := bson.D{{"$set", bson.D{{"name", gun.Name}, {"manufacturer", gun.Manufacturer}, {"model", gun.Model}, {"caliber", gun.Caliber}, {"roundcount", gun.RoundCount}, {"accessories", gun.Accessories}, {"maintenance", gun.Maintenance}}}}

	_, err := gunsCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
}

func UserOwnsGun(gunId string, userId string) bool {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	id, _ := primitive.ObjectIDFromHex(gunId)
	filter := bson.D{{"_id", id}, {"user_id", userId}}

	var gun models.Gun

	err := gunsCollection.FindOne(context.Background(), filter).Decode(&gun)
	if err != nil {
		log.Fatal(err)
	}

	return gun.ID != primitive.NilObjectID
}

func GetGunById(gunId primitive.ObjectID) models.Gun {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	var gun models.Gun

	filter := bson.D{{"_id", gunId}}

	err := gunsCollection.FindOne(context.Background(), filter).Decode(&gun)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Found gun %s - %d\n", gun.Name, gun.RoundCount)

	return gun
}
func GetGun(gunId string) models.Gun {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	var gun models.Gun

	id, _ := primitive.ObjectIDFromHex(gunId)
	fmt.Printf("id: %s\n", id)
	filter := bson.D{{"_id", id}}

	err := gunsCollection.FindOne(context.Background(), filter).Decode(&gun)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Found gun %s - %d\n", gun.Name, gun.RoundCount)

	return gun
}

// slightly different from update gun, no accessories or maintenance
func EditGun(gun *models.Gun) {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	filter := bson.D{{"_id", gun.ID}}
	// pass all fields to be updated
	update := bson.D{{"$set", bson.D{{"name", gun.Name}, {"manufacturer", gun.Manufacturer}, {"model", gun.Model}, {"caliber", gun.Caliber}, {"roundcount", gun.RoundCount}}}}

	_, err := gunsCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
}

func InsertGun(gun *models.Gun) {
	client := GetClient()

	// ensure it's new id
	gun.ID = primitive.NewObjectID()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")
	opts := options.Update().SetUpsert(true)

	filter := bson.D{{"name", gun.Name}, {"manufacturer", gun.Manufacturer}, {"caliber", gun.Caliber}, {"model", gun.Model}, {"user_id", gun.UserID}}

	update := bson.D{
		{"$set", bson.D{{"roundcount", gun.RoundCount}}},
	}

	log.Println("Right before updateone()")
	_, err := gunsCollection.UpdateOne(context.Background(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}

func RemoveGun(gunId string) {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	id, _ := primitive.ObjectIDFromHex(gunId)
	filter := bson.D{{"_id", id}}

	_, err := gunsCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
}

func GetGuns(user *models.User) []models.Gun {
	client := GetClient()

	gunsCollection := client.Database("ATFGunDB").Collection("guns")

	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(100)

	// Here's an array in which you can store the decoded documents
	var results []models.Gun = make([]models.Gun, 0)

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := gunsCollection.Find(context.Background(), bson.D{{"user_id", user.ID}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.Background()) {

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
	cur.Close(context.Background())

	fmt.Printf("Found multiple documents (array of pointers): %+v\n", results)
	return results
}
