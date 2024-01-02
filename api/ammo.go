package api

import (
	"net/http"
	"atfgundb.com/app/models"
	"github.com/gin-gonic/gin"
)

func ListAmmo(c *gin.Context) {
	var ammo = []models.Ammo{
		{
			Name:  "Federal HST",
			Count: 900,
		},
		{
			Name:  "115 GR 9MM BALL",
			Count: 800,
		},
	}

	c.JSON(http.StatusOK, ammo)
}
