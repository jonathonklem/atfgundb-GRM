package api

import (
	"log"
	"net/http"
	"os"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"atfgundb.com/app/routing"
	"github.com/gin-gonic/gin"
)

func GetRangeTrips(c *gin.Context) {
	userId := c.Query("user_id")

	rangeTrips := db.GetRangeTrips(userId)

	c.JSON(http.StatusOK, rangeTrips)
}

func GetAmmoReport(c *gin.Context) {
	userId := c.Query("user_id")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")

	ammoReport := db.GetAmmoReport(userId, dateFrom, dateTo)

	c.JSON(http.StatusOK, ammoReport)
}

func GetGunReport(c *gin.Context) {
	userId := c.Query("user_id")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")

	gunReport := db.GetGunReport(userId, dateFrom, dateTo)

	c.JSON(http.StatusOK, gunReport)
}

func GetDateAndAmmoReport(c *gin.Context) {
	userId := c.Query("user_id")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")

	dateAndAmmoReport := db.GetDateAndAmmoReport(userId, dateFrom, dateTo)

	c.JSON(http.StatusOK, dateAndAmmoReport)
}

func AddRangeTrip(c *gin.Context) {
	var rangeTripPost models.RangeTripPost

	if err := c.BindJSON(&rangeTripPost); err != nil {
		log.Printf("Error binding JSON: %v", err)
		log.Fatal("Unable to BindJSON RangeTrip")
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "System error"})
	}

	if os.Getenv("ALLOWED_ORIGIN") != "http://localhost:3000" && os.Getenv("ALLOWED_ORIGIN") != "http://localhost:8100" {
		if rangeTripPost.UserId != routing.UserId {
			c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
			return
		}
	}

	var err error
	var rangeTrip models.RangeTrip
	var errorString = ""
	var successString = ""
	var gun models.Gun

	for _, weaponGroup := range rangeTripPost.WeaponGroups {
		if os.Getenv("ALLOWED_ORIGIN") != "http://localhost:3000" && os.Getenv("ALLOWED_ORIGIN") != "http://localhost:8100" {
			if !db.UserOwnsGun(weaponGroup.GunId.Hex(), routing.UserId) {
				c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
				return
			}

			if !db.UserOwnsAmmo(weaponGroup.AmmoId.Hex(), routing.UserId) {
				c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
				return
			}
		}

		err = consumeAmmo(weaponGroup.AmmoId.Hex(), weaponGroup.QuantityUsed)
		gun = db.GetGun(weaponGroup.GunId.Hex())

		if err != nil {
			errorString += gun.Name + ": " + err.Error() + " \n"
		} else {

			// don't need ID or datedone
			rangeTrip = models.RangeTrip{
				Location:     rangeTripPost.Location,
				AmmoId:       weaponGroup.AmmoId,
				GunId:        weaponGroup.GunId,
				QuantityUsed: weaponGroup.QuantityUsed,
				UserId:       rangeTripPost.UserId,
				Note:         rangeTripPost.Note,
			}
			db.InsertRangeTrip(&rangeTrip)
			successString += gun.Name + ": " + "Successly saved. \n"
		}
	}
	if errorString != "" {
		c.JSON(500, models.Response{Success: false, Error: successString + errorString})
	} else {
		c.JSON(http.StatusOK, models.Response{Success: true})
	}
}
