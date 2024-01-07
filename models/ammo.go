package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ammo struct {
	Name         string             `json:"name"`
	Count        int                `json:"amount" bson:"count"`
	Grain        string             `json:"grain"`
	Caliber      string             `json:"caliber"`
	Averageprice float32            `json:"average_price"`
	LastPrice    float32            `json:"last_price"`
	UserID       string             `json:"user_id"`
	ID           primitive.ObjectID `bson:"_id"`
}

type AmmoPurchase struct {
	ID            primitive.ObjectID `bson:"_id"`
	AmmoId        string             `json:"ammo_id" bson:"ammo_id"`
	Price         float32            `json:"price"`
	Quantity      int                `json:"quantity"`
	QuantityUsed  int                `json:"quantityused"`
	DatePurchased primitive.DateTime `json:"date_purchased"`
}
