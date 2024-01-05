package api

import (
	"net/http"

	"log"

	"atfgundb.com/app/db"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

func AddGun(c *gin.Context) {
	var gun models.Gun

	if err := c.BindJSON(&gun); err != nil {
		log.Fatal("Unable to BindJSON")
	}

	log.Println("Calling insertupdategun")
	db.InsertUpdateGun(&gun)
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
