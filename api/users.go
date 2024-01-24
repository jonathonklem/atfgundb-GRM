package api

import (
	"net/http"
	"atfgundb.com/app/models"
	"atfgundb.com/app/db"
	"github.com/gin-gonic/gin"
	"log"
)

func UserDeleteTest(c *gin.Context) {
	user_id := c.Query("user_id")
	if user_id == "" {
		c.JSON(http.StatusOK, "{error: 'Invalid UserId'}")
	}

	log.Println("Not actually deleting anything")
	c.JSON(http.StatusOK, "{success: true}")
}

func UserDelete(c *gin.Context) {
	user_id := c.Query("user_id")
	if user_id == "" {
		c.JSON(http.StatusOK, "{error: 'Invalid UserId'}")
	}

	log.Println("Calling deleteuser")
	db.DeleteUser(user_id)
	c.JSON(http.StatusOK, "{success: true}")
}

func UserSaveVisit(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		log.Fatal("Unable to BindJSON")	
	}

	log.Println("Calling insertupdateuser")
	db.InsertUpdateUser(&user)
	c.JSON(http.StatusOK, "{success: true}")
}