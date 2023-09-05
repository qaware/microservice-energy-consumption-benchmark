package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"main/app/health"
	"main/app/process"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()
	router.Use(gin.Recovery())

	healthGroup := router.Group("/health")
	healthGroup.GET("/started", health.Started)
	healthGroup.GET("/live", health.Live)
	healthGroup.GET("/ready", health.Ready)

	apiGroup := router.Group("/api")
	apiGroup.POST("/process/:key", process.ProcessData)

	log.Println("Starting to serve requests on :8082")
	_ = router.Run(":8082")
}
