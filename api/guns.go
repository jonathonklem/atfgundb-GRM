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
		c.JSON(500, models.Response{Success: false, Error: "Invalid GunID"})
	}

	if db.UserOwnsGun(gun_id, routing.UserId) {
		db.RemoveGun(gun_id)
		c.JSON(http.StatusOK, models.Response{Success: true})	
	} else {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	}
	
}
func AddAccessoryToGun(c *gin.Context) {
	var accessory models.Accessory
	var gun models.Gun

	log.Printf("Received gun+id: %s\n", c.Query("gun_id"))

	gun = db.GetGun(c.Query("gun_id"))

	if err := c.BindJSON(&accessory); err != nil {
		log.Fatal("Unable to BindJSON")
		c.JSON(500, models.Response{Success: false, Error: "System error"})
	}

	if db.UserOwnsGun(c.Query("gun_id"), routing.UserId) {
		gun.Accessories = append(gun.Accessories, accessory)

		db.UpdateGun(gun)
		c.JSON(http.StatusOK, models.Response{Success: true})
	} else {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	}

	
}
func EditGun(c *gin.Context) {
	var gun models.Gun

	if err := c.BindJSON(&gun); err != nil {
		log.Fatal("Unable to BindJSON")
		c.JSON(500, models.Response{Success: false, Error: "System error"})

	}

	if (gun.UserID != routing.UserId) {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	} else {
		db.EditGun(&gun)
		c.JSON(http.StatusOK, models.Response{Success: true})
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
			c.JSON(500, models.Response{Success: false, Error: "System error"})
		}

		// set maintenance datetime to right now
		maintenance.DateDone = primitive.NewDateTimeFromTime(time.Now())

		gun.Maintenance = append(gun.Maintenance, maintenance)

		db.UpdateGun(gun)
		c.JSON(http.StatusOK, models.Response{Success: true})
	} else {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	}
}

func AddGun(c *gin.Context) {
	var gun models.Gun

	if err := c.BindJSON(&gun); err != nil {
		log.Fatal("Unable to BindJSON")
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	}

	if (gun.UserID != routing.UserId) {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Unauthorized"})
	} else {
		db.InsertGun(&gun)
		c.JSON(http.StatusOK, models.Response{Success: true})
	}
}

func ListGuns(c *gin.Context) {
	var user models.User
	user.ID = c.Query("user_id")	// automatically blocked in router if invalid auth

	guns := db.GetGuns(&user)

	c.JSON(http.StatusOK, guns)
}
