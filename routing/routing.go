package routing

import (
	"errors"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/lestrrat/go-jwx/jwk"
)

// Exporting constants to avoid hardcoding these all over, and ending up with a uppercase "POST" bug in the future.
const (
	GET     = "get"
	POST    = "post"
	jwksURL = "https://dev-bxzha665kfgz0ltz.us.auth0.com/.well-known/jwks.json"
)

func Build() *gin.Engine {
	engine := gin.New()

	engine.Use(gin.Logger())
	engine.Use(gin.Recovery())
	engine.Use(CORS())
	engine.Use(CheckJWT())

	return engine
}

func CheckJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		if os.Getenv("ALLOWED_ORIGIN") == "http://localhost:3000" {
			c.Next()
		} else {
			// fetch authorization header from context
			providedToken := c.Request.Header.Get("Authorization")

			if providedToken == "" {
				c.AbortWithStatusJSON(401, gin.H{"error": "No Authorization header provided"})
				return
			}

			// remove Bearer prefix from token
			providedToken = strings.Replace(providedToken, "Bearer ", "", 1)

			_, err := jwt.Parse(providedToken, getKey)
			if err != nil {
				c.AbortWithStatusJSON(401, gin.H{"error": "Invalid authorization header"})
				return
			}

			c.Next()
		}

	}
}

func getKey(token *jwt.Token) (interface{}, error) {

	// TODO: cache response so we don't have to make a request every time
	// we want to verify a JWT
	set, err := jwk.FetchHTTP(jwksURL)
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have string kid")
	}

	if key := set.LookupKeyID(keyID); len(key) == 1 {
		return key[0].Materialize()
	}

	return nil, errors.New("unable to find key")
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: make this configurable
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")

		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		// Handle browser preflight requests, where it asks for allowed origin.
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func setMethodHandler(method string, path string, fn gin.HandlerFunc, group *gin.RouterGroup) {
	switch method {
	case POST:
		group.POST(path, fn)
	case GET:
		group.GET(path, fn)
	}
}

// Add a new endpoint mapping
func AddRoute(engine *gin.Engine, path string, method string, fn gin.HandlerFunc) *gin.Engine {
	group := engine.Group("/")
	setMethodHandler(method, path, fn, group)
	return engine
}
