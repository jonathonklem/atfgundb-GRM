package models

type Ammo struct {
	Name         string  `json:"name"`
	Count        int     `json:"amount"`
	Grain        string  `json:"grain"`
	Averageprice float32 `json:"average_price"`
	LastPrice    float32 `json:"last_price"`
}

type AmmoPurchase struct {
	AmmoId	string `json:"ammo_id"`
	Price 	float32 `json:"price"`
	Quantity	int	`json:"quantity"`
	QuantityUsed	int `json:"quantity_used"`
}