package main

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"sample-micro-service/internal/sample"
	"sample-micro-service/pkg/service/auth"
	"sample-micro-service/pkg/service/health"
	"sample-micro-service/pkg/service/log"
)

var (
	logger = log.WithName("main")
)

func setupRouter() *gin.Engine {
	router := gin.New()

	// recover from any panics and write an HTTP 500 error
	router.Use(gin.Recovery())

	// do not trust any proxy, this is a security measure
	err := router.SetTrustedProxies(nil)
	if err != nil {
		logger.FatalOnError(err, "Failed to disable trusted proxies")
		return nil // not strictly necessary, as this will never be reached
	}

	// health-check endpoints
	healthCheck := router.Group("/health")
	{
		healthCheck.GET("/live", health.Check)
		healthCheck.GET("/ready", health.Check)
		healthCheck.GET("/started", health.Check)
	}

	// metrics endpoint
	router.GET("/metrics", func(context *gin.Context) {
		promhttp.Handler().ServeHTTP(context.Writer, context.Request)
	})

	// API endpoints
	api := router.Group("/api/sample/items", auth.JwtAuth())
	{
		api.GET("", sample.Overview)
		api.GET(":id", sample.Details)
	}

	return router
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	gin.DisableConsoleColor()

	router := setupRouter()
	if router == nil {
		return
	}

	// listen and serve on 0.0.0.0:8080
	err := router.Run(":8080")
	if err != nil {
		logger.FatalOnError(err, "Failed to set-up the router")
		return // not strictly necessary, as this will never be reached
	}
}
