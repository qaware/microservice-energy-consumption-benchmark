package health

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	healthStatusUp   = "UP"
	healthStatusDown = "DOWN"
)

type healthCheck struct {
	Name   string `json:"name"`
	Status string `json:"status"`
}

type Health struct {
	Status string        `json:"status"`
	Checks []healthCheck `json:"checks"`
}

func Check(c *gin.Context) {
	healthChecks := make([]healthCheck, 5)
	healthChecks = append(healthChecks, healthCheck{Name: "application", Status: healthStatusUp})

	c.JSON(http.StatusOK, &Health{Status: healthStatusUp, Checks: nil})
}
