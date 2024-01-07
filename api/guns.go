package api

import (
	"net/http"

	"log"

	"time"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddAccessoryToGun(c *gin.Context) {
	var accessory models.Accessory
	var gun models.Gun

	log.Printf("Received gun+id: %s\n", c.Query("gun_id"))

	gun = db.GetGun(c.Query("gun_id"))

	if err := c.BindJSON(&accessory); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	gun.Accessories = append(gun.Accessories, accessory)

	db.UpdateGun(gun)
	c.JSON(http.StatusOK, "{success: true}")
}

func AddMaintenanceToGun(c *gin.Context) {
	var maintenance models.Maintenance
	var gun models.Gun

	log.Printf("Received gun+id: %s\n", c.Query("gun_id"))

	gun = db.GetGun(c.Query("gun_id"))

	if err := c.BindJSON(&maintenance); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	// set maintenance datetime to right now
	maintenance.DateDone = primitive.NewDateTimeFromTime(time.Now())

	gun.Maintenance = append(gun.Maintenance, maintenance)

	db.UpdateGun(gun)
	c.JSON(http.StatusOK, "{success: true}")
}

func AddGun(c *gin.Context) {
	var gun models.Gun

	if err := c.BindJSON(&gun); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	log.Println("Calling insertupdategun")
	db.InsertGun(&gun)
	c.JSON(http.StatusOK, "{success: true}")
}

func ListGuns(c *gin.Context) {
	// TODO: is this authentication safe?  I don't think it is
	// but it appears that we're limiting where requests are coming from.....

	var user models.User
	user.ID = c.Query("user_id")

	guns := db.GetGuns(&user)
	for i := range guns {
		log.Printf("Round count: %d\n", guns[i].RoundCount)
	}

	c.JSON(http.StatusOK, guns)
}
