package api

import (
	"net/http"

	"log"

	"time"

	"atfgundb.com/app/routing"
	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RemoveGun(c *gin.Context) {
	gun_id := c.Query("gun_id")
	if gun_id == "" {
		c.JSON(http.StatusOK, "{error: 'Invalid GunID'}")
	}

	if db.UserOwnsGun(gun_id, routing.UserId) {
		db.RemoveGun(gun_id)
		c.JSON(http.StatusOK, "{success: true}")		
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}
	
}
func AddAccessoryToGun(c *gin.Context) {
	var accessory models.Accessory
	var gun models.Gun

	log.Printf("Received gun+id: %s\n", c.Query("gun_id"))

	gun = db.GetGun(c.Query("gun_id"))

	if err := c.BindJSON(&accessory); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	if db.UserOwnsGun(c.Query("gun_id"), routing.UserId) {
		gun.Accessories = append(gun.Accessories, accessory)

		db.UpdateGun(gun)
		c.JSON(http.StatusOK, "{success: true}")
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}

	
}

func AddMaintenanceToGun(c *gin.Context) {
	var maintenance models.Maintenance
	var gun models.Gun

	log.Printf("Received gun+id: %s\n", c.Query("gun_id"))

	if db.UserOwnsGun(c.Query("gun_id"), routing.UserId) {
		gun = db.GetGun(c.Query("gun_id"))

		if err := c.BindJSON(&maintenance); err != nil {
			log.Fatal("Unable to BindJSON")
		}

		// set maintenance datetime to right now
		maintenance.DateDone = primitive.NewDateTimeFromTime(time.Now())

		gun.Maintenance = append(gun.Maintenance, maintenance)

		db.UpdateGun(gun)
		c.JSON(http.StatusOK, "{success: true}")
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}
}

func AddGun(c *gin.Context) {
	var gun models.Gun

	if err := c.BindJSON(&gun); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	if (gun.UserID != routing.UserId) {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	} else {
		db.InsertGun(&gun)
		c.JSON(http.StatusOK, "{success: true}")
	}
}

func ListGuns(c *gin.Context) {
	var user models.User
	user.ID = c.Query("user_id")	// automatically blocked in router if invalid auth

	guns := db.GetGuns(&user)
	for i := range guns {
		log.Printf("Round count: %d\n", guns[i].RoundCount)
	}

	c.JSON(http.StatusOK, guns)
}
