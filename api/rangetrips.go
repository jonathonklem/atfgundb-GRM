package api

import (
	"log"
	"net/http"
	"os"
	"atfgundb.com/app/routing"
	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

func GetRangeTrips(c *gin.Context) {
	userId := c.Query("user_id")

	rangeTrips := db.GetRangeTrips(userId)

	c.JSON(http.StatusOK, rangeTrips)
}

func GetDateAndAmmoReport(c *gin.Context) {
	userId := c.Query("user_id")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")

	dateAndAmmoReport := db.GetDateAndAmmoReport(userId, dateFrom, dateTo)

	c.JSON(http.StatusOK, dateAndAmmoReport)
}

func AddRangeTrip(c *gin.Context) {
	var rangeTrip models.RangeTrip

	if err := c.BindJSON(&rangeTrip); err != nil {
		log.Printf("Error binding JSON: %v", err)
		log.Fatal("Unable to BindJSON RangeTrip")
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "System error"})
	}

	if os.Getenv("ALLOWED_ORIGIN") != "http://localhost:3000" && os.Getenv("ALLOWED_ORIGIN") != "http://localhost:8100" {
		if rangeTrip.UserId != routing.UserId {
			c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
			return
		}

		if !db.UserOwnsGun(rangeTrip.GunId.Hex(), routing.UserId) {
			c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
			return
		}

		if !db.UserOwnsAmmo(rangeTrip.AmmoId.Hex(), routing.UserId) {
			c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
			return
		}
	}
	db.InsertRangeTrip(&rangeTrip)

	consumeAmmo(rangeTrip.AmmoId.Hex(), rangeTrip.QuantityUsed)

	c.JSON(http.StatusOK, models.Response{Success: true})
}
