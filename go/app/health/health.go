package health

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type healthCheck struct {
	Status string `json:"status"`
}

func Started(c *gin.Context) {
	c.JSON(http.StatusOK, &healthCheck{Status: "OK"})
}

func Live(c *gin.Context) {
	c.JSON(http.StatusOK, &healthCheck{Status: "OK"})
}

func Ready(c *gin.Context) {
	c.JSON(http.StatusOK, &healthCheck{Status: "OK"})
}
