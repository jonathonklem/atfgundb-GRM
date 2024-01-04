package api

import (
	"net/http"
	"atfgundb.com/app/models"
	"atfgundb.com/app/db"
	"github.com/gin-gonic/gin"
	"log"
)

func UserSaveVisit(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		log.Fatal("Unable to BindJSON")	
	}

	log.Println("Calling insertupdateuser")
	db.InsertUpdateUser(&user)
	c.JSON(http.StatusOK, "{success: true}")
}