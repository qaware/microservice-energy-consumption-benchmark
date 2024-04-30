package health

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	healthStatusUp = "UP"
)

type Health struct {
	Status string `json:"status"`
}

func Check(c *gin.Context) {
	c.JSON(http.StatusOK, &Health{Status: healthStatusUp})
}
