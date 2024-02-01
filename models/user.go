package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Email     string             `json:"email"`
	LastLogin primitive.DateTime `json:"lastlogin"`
	ID        string             `json:"id"`
	Name      string             `json:"name"`
}

type Deletion struct {
	DeletedDate primitive.DateTime `json:"deleteddate"`
}