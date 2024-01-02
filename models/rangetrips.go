package models

type RangeTrip struct {
	DateDone string `json:"date_done"`
	Location string `json:"location"`
	AmmoId string `json:"ammo_id"`
	GunId string `json:"gun_id"`
	QuantityUsed int `json:"quantity_used"`
}