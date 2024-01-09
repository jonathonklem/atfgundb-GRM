package api

import (
	"log"
	"net/http"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

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
	}

	db.InsertRangeTrip(&rangeTrip)

	consumeAmmo(rangeTrip.AmmoId.Hex(), rangeTrip.QuantityUsed)

	c.JSON(http.StatusOK, "{success: true}")
}
