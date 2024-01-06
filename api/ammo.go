package api

import (
	"log"
	"net/http"

	"time"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddAmmoPurchase(c *gin.Context) {
	var ammoPurchase models.AmmoPurchase

	if err := c.BindJSON(&ammoPurchase); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	ammoPurchase.DatePurchased = primitive.NewDateTimeFromTime(time.Now())
	db.InsertAmmoPurchase(&ammoPurchase)
	c.JSON(http.StatusOK, "{success: true}")
}

func AddAmmo(c *gin.Context) {
	var ammo models.Ammo

	if err := c.BindJSON(&ammo); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	log.Println("Calling insertupdategun")
	db.InsertUpdateAmmo(&ammo)
	c.JSON(http.StatusOK, "{success: true}")
}

func ListAmmo(c *gin.Context) {

	var user models.User
	user.ID = c.Query("user_id")

	ammo := db.GetAmmo(&user)

	c.JSON(http.StatusOK, ammo)
}
