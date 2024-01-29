package api

import (
	"log"
	"net/http"

	"strconv"
	"time"
	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"atfgundb.com/app/routing"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RemoveAmmo(c *gin.Context) {
	ammoId := c.Query("ammo_id")

	if (db.UserOwnsAmmo(ammoId, routing.UserId)) {
		db.RemoveAmmo(ammoId)
		c.JSON(http.StatusOK, "{success: true}")
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}
}

func EditAmmo(c *gin.Context) {
	var ammo models.Ammo

	if err := c.BindJSON(&ammo); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	if (ammo.UserID != routing.UserId) {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	} else {
		db.EditAmmo(&ammo)
		c.JSON(http.StatusOK, "{success: true}")
	}
}

func AddAmmoPurchase(c *gin.Context) {
	var ammoPurchase models.AmmoPurchase

	if err := c.BindJSON(&ammoPurchase); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	if (db.UserOwnsAmmo(ammoPurchase.AmmoId, routing.UserId)) {
		ammoPurchase.DatePurchased = primitive.NewDateTimeFromTime(time.Now())
		db.InsertAmmoPurchase(&ammoPurchase)

		c.JSON(http.StatusOK, "{success: true}")
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}
	
}

func DisposeAmmo(c *gin.Context) {
	ammoId := c.Query("ammo_id")
	quantity := c.Query("quantity")

	if (db.UserOwnsAmmo(ammoId, routing.UserId)) {
		// convert quantity to int
		squantity, _ := strconv.Atoi(quantity)

		consumeAmmo(ammoId, squantity)

		c.JSON(http.StatusOK, "{success: true}")
	} else {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	}
}

// would have loved to done this as a method on AmmoPurchase, but that was causing circular import issues
// since db and model are separate packages
func consumeAmmo(ammoId string, quantity int) error {
	ammoPurchases := db.GetAmmoActivePurchases(ammoId)
	quantityConsumed := int(0)

	for _, ammoPurchase := range ammoPurchases {
		if (ammoPurchase.Quantity - ammoPurchase.QuantityUsed) >= (quantity) {
			ammoPurchase.QuantityUsed += quantity
			quantityConsumed = quantity
		} else {
			available := ammoPurchase.Quantity - ammoPurchase.QuantityUsed

			ammoPurchase.QuantityUsed += available
			quantityConsumed += available
		}
		db.UpdateAmmoPurchase(&ammoPurchase)

		if quantityConsumed == quantity {
			break
		}
		quantity -= quantityConsumed
	}

	// next update quantity on actual ammo id
	ammo := db.GetAmmoById(ammoId)
	log.Printf("ammo: %v", ammo)
	ammo.Count -= quantityConsumed
	log.Printf("ammo: %v", ammo)
	db.InsertUpdateAmmo(&ammo)

	// i guess we're not really returning an error...
	return nil
}

func AddAmmo(c *gin.Context) {
	var ammo models.Ammo

	if err := c.BindJSON(&ammo); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	if ammo.UserID != routing.UserId {
		c.JSON(http.StatusUnauthorized, "{error: 'Unauthorized'}")
	} else {
		db.InsertUpdateAmmo(&ammo)
		c.JSON(http.StatusOK, "{success: true}")
	}
	
}

func ListAmmo(c *gin.Context) {

	var user models.User
	user.ID = c.Query("user_id")

	ammo := db.GetAmmo(&user)

	c.JSON(http.StatusOK, ammo)
}
