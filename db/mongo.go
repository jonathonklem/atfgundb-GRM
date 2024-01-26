package db

import (
	"context"
	"log"
	"os"

	//"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MasterClient *mongo.Client;

func init() {
	log.Println("db init()")
	mongoString := os.Getenv("MONGO_URL")
	log.Println("mongoString: " + mongoString)
	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(mongoString).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	var err error
	MasterClient, err = mongo.Connect(context.Background(), opts)
	if err != nil {
		log.Println("Mongo panic:")
		panic(err)
	}
	log.Println("Have client: %v", MasterClient);
}

func GetClient() *mongo.Client {
	return MasterClient
}

func KillClient() {
	if MasterClient != nil {
		MasterClient.Disconnect(context.Background())
	}
}	
