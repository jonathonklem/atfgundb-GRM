package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type RangeTrip struct {
	DateDone     primitive.DateTime `json:"date_done,omitempty" bson:"date_done,omitempty"`
	Location     string             `json:"location" bson:"location"`
	AmmoId       primitive.ObjectID `json:"ammo_id" bson:"ammo_id"`
	GunId        primitive.ObjectID `json:"gun_id" bson:"gun_id"`
	QuantityUsed int                `json:"quantity_used" bson:"quantity_used"`
	UserId       string             `json:"user_id" bson:"user_id"`
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Note         string             `json:"note,omitempty" bson:"note,omitempty"`
}

type WeaponGroup struct {
	AmmoId       primitive.ObjectID `json:"ammo_id" bson:"ammo_id"`
	GunId        primitive.ObjectID `json:"gun_id" bson:"gun_id"`
	QuantityUsed int                `json:"quantity_used" bson:"quantity_used"`
}
type RangeTripPost struct {
	UserId       string             `json:"user_id" bson:"user_id"`
	DateDone     primitive.DateTime `json:"date_done,omitempty"`
	Location     string             `json:"location"`
	WeaponGroups []WeaponGroup      `json:"weapon_groups"`
	Note         string             `json:"note,omitempty"`
}
