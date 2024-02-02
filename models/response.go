package models

type Response struct {
	Success bool `json:"success,omitempty"`
	Error   string `json:"error,omitempty"`
}