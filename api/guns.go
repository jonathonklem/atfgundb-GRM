package api

import (
	"net/http"

	"log"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

func ListGuns(c *gin.Context) {
	// TODO: is this authentication safe?  I don't think it is
	// but it appears that we're limiting where requests are coming from.....

	var user models.User
	user.ID = c.Query("user_id")

	guns := db.GetGuns(&user)
	for i := range guns {
		log.Printf("Round count: %d\n", guns[i].RoundCount)
	}
	/*
		var guns = []models.Gun{
			{
				Name:  "Poverty Pony",
				Manufacturer: "Anderson",
				Model: "AR15",
				Caliber: "5.56",
				RoundCount: 1000,
				Accessories : []models.Accessory{
					{
						Name: "XPS3",
						Model: "XPS3",
						Manufacturer: "EOTech",

					},
					{
						Name: "TLR6",
						Model: "TLR6",
						Manufacturer: "Streamlight",

					},
				},
			},
			{
				Name:  "P80 Glock",
				Manufacturer: "P80",
				Model: "VPS8",
				Caliber: "9mm",
				RoundCount: 2000,
				Accessories : []models.Accessory{
					{
						Name: "EPS Carry",
						Model: "EPS",
						Manufacturer: "Holosun",

					},
					{
						Name: "TLR7a",
						Model: "TLR7a",
						Manufacturer: "Streamlight",

					},
				},
			},
		}
	*/
	//name := c.Query("name")
	c.JSON(http.StatusOK, guns)
}
