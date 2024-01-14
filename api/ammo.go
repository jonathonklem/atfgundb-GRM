package api

import (
	"log"
	"net/http"

	"strconv"
	"time"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RemoveAmmo(c *gin.Context) {
	ammoId := c.Query("ammo_id")

	db.RemoveAmmo(ammoId)

	c.JSON(http.StatusOK, "{success: true}")
}

func AddAmmoPurchase(c *gin.Context) {
	var ammoPurchase models.AmmoPurchase

	if err := c.BindJSON(&ammoPurchase); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	ammoPurchase.DatePurchased = primitive.NewDateTimeFromTime(time.Now())
	db.InsertAmmoPurchase(&ammoPurchase)

	c.JSON(http.StatusOK, "{success: true}")
}

func DisposeAmmo(c *gin.Context) {
	ammoId := c.Query("ammo_id")
	quantity := c.Query("quantity")

	// convert quantity to int
	squantity, _ := strconv.Atoi(quantity)

	consumeAmmo(ammoId, squantity)

	c.JSON(http.StatusOK, "{success: true}")
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
