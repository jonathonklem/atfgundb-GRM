package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Gun struct {
	Name         string             `json:"name"`
	Manufacturer string             `json:"manufacturer"`
	Model        string             `json:"model"`
	Caliber      string             `json:"caliber"`
	RoundCount   int                `json:"roundcount"`
	UserID       string             `json:"user_id"`
	Accessories  []Accessory        `json:"accessories"`
	ID           primitive.ObjectID `bson:"_id"`
}

type Accessory struct {
	Name         string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	Model        string `json:"model"`
}

type Maintenance struct {
	DateDone        string `json:"date_done"`
	MaintenanceDone string `json:"maintenance_type"`
}
