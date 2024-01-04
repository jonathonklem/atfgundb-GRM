package db

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/joho/godotenv"
	"os"
	"log"
	"atfgundb.com/app/models"
	"time"
)

func getClient() *mongo.Client{
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoString := os.Getenv("MONGO_URL")

	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(mongoString).SetServerAPIOptions(serverAPI)
	
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	return client
}

func InsertUpdateUser(user *models.User) {
	client := getClient()

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
		}
	}()
	usersCollection := client.Database("ATFGunDB").Collection("users")
	opts := options.Update().SetUpsert(true)

	filter := bson.D{{"email", user.Email}, {"id", user.ID}, {"name", user.Name}}

	update := bson.D{
		{"$set", bson.D{{"lastlogin",time.Now().Format(time.RFC3339)}}},
	}

	log.Println("Right before updateone()")
	_, err := usersCollection.UpdateOne(context.TODO(), filter, update, opts)

	if err != nil {
		log.Println("Err wasnt nil")
		log.Fatal(err)
	}
}
func DontExecute() {
	client := getClient()
	usersCollection := client.Database("ATFGunDB").Collection("users")
	
	// Pass these options to the Find method
	findOptions := options.Find()
	findOptions.SetLimit(2)

	// Here's an array in which you can store the decoded documents
	var results []*models.User

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := usersCollection.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {
		
		// create a value into which the single document can be decoded
		var elem models.User
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("Found user %s\n", elem.Email)
		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	fmt.Printf("Found multiple documents (array of pointers): %+v\n", results)
	/*
	// example of update
	filter := bson.D{{"id", "TESTX"}}

	update := bson.D{
		{"$set", bson.D{{"lastlogin","2024-01-03 19:51:00"}}},
	}
	updateResult, err := usersCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)
	
	// example to insert document
	
	user := models.User{"testuser@dayat.net","","TESTX","Jim Testerson"}
	insertResult, err := usersCollection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a single document: ", insertResult.InsertedID)
	
	// example to create collection
	if err := client.Database("ATFGunDB").RunCommand(context.TODO(), bson.D{{"create", "users"}}).Err(); err != nil {
		panic (err)
	} else {
		fmt.Println("Created collection users");
	}

	
	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")*/
}