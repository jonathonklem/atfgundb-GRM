package models

type Gun struct {
	Name         string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	Model        string `json:"model"`
	Caliber      string `json:"caliber"`
	RoundCount   int    `json:"round_count"`
	Accessories	 []Accessory `json:"accessories"`
}

type Accessory struct {
	Name string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	Model string `json:"model"`
}