package api

import (
	"log"
	"net/http"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

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
