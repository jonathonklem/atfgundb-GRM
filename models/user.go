package models

type User struct {
	Email		string  `json:"email"`
	LastLogin	string	`json:"lastlogin"`
	ID        	string  `json:"id"`
	Name		string 	`json:"name"`
}