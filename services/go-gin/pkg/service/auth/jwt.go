package auth

import (
	"github.com/MicahParks/keyfunc/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"sample-micro-service/pkg/service/config"
	"sample-micro-service/pkg/service/log"
	"strings"
	"time"
)

const RawToken = "auth-property-raw-token"
const UserId = "auth-property-user-id"

var (
	logger      = log.WithName("auth")
	jwksKeyFunc jwt.Keyfunc
)

func init() {
	jwksUrl := config.GetString("auth.jwt.jwks-url") + "/.well-known/jwks.json"

	options := keyfunc.Options{
		RefreshErrorHandler: func(err error) {
			logger.Warn("Failed to refresh from JWKS: %s", err.Error())
		},
		RefreshInterval:   time.Hour,
		RefreshRateLimit:  time.Minute * 5,
		RefreshTimeout:    time.Second * 10,
		RefreshUnknownKID: true,
	}

	jwks, err := keyfunc.Get(jwksUrl, options)
	if err != nil {
		logger.FatalOnError(err, "Failed to create JWKS from %s", jwksUrl)
	}

	jwksKeyFunc = jwks.Keyfunc
}

func JwtAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, found := strings.CutPrefix(c.GetHeader("Authorization"), "Bearer ")
		if !found {
			logger.Debug("Missing authentication header or missing bearer scheme")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(strings.TrimSpace(tokenString), jwksKeyFunc, // findVerificationKey,
			jwt.WithIssuer(config.GetString("auth.jwt.expected-issuer")),
			jwt.WithAudience(config.GetString("auth.jwt.expected-audience")))
		if err != nil {
			logger.Debug("Invalid bearer token: %v", err)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		subject, err := token.Claims.GetSubject()
		if err != nil {
			logger.Debug("Missing subject in JWT")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		logger.Debug("Authenticated as '%v'", subject)

		c.Set(UserId, subject)
		c.Set(RawToken, tokenString)
	}
}
