package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DateAndAmmoReport struct {
	ID struct {
		DateDone string `json:"date_done" bson:"date_done"`
		AmmoID   primitive.ObjectID `json:"ammo_id" bson:"ammo_id"`
	} `json:"_id" bson:"_id"`
	AmmoName []string           `json:"ammo_name" bson:"ammo_name"`
	Date     string `json:"date" bson:"date"`
	Count    int                `json:"count" bson:"count"`
}
