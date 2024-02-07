package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ammo struct {
	Name         string             `json:"name" bson:"name"`
	Count        int                `json:"amount" bson:"count"`
	Grain        string             `json:"grain" bson:"grain"`
	Caliber      string             `json:"caliber" bson:"caliber"`
	Averageprice float64            `json:"average_price" bson:"average_price"`
	LastPrice    float64            `json:"last_price" bson:"last_price"`
	UserID       string             `json:"user_id" bson:"user_id"`
	ID           primitive.ObjectID `bson:"_id"`
}

type AmmoReportEntry struct {
	AmmoName    []string `json:"ammo_name"  bson:"ammo_name"`
	TotalRounds int      `json:"count" bson:"count"`
}

type AmmoPurchase struct {
	ID            primitive.ObjectID `bson:"_id"`
	AmmoId        string             `json:"ammo_id" bson:"ammo_id"`
	Price         float64            `json:"price" bson:"price"`
	Quantity      int                `json:"quantity" bson:"quantity"`
	QuantityUsed  int                `json:"quantityused" bson:"quantityused"`
	DatePurchased primitive.DateTime `json:"date_purchased" bson:"date_purchased"`
}
