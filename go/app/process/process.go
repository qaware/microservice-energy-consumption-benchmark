package process

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type processRequest struct {
	Id   string    `json:"id"`
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}

type processResponse struct {
	Id        string    `json:"data"`
	CreatedAt time.Time `json:"created_at"`
	Status    string    `json:"status"`
}

func ProcessData(c *gin.Context) {
	key := c.Param("key")

	var request processRequest
	if err := c.BindJSON(&request); err != nil {
		// DO SOMETHING WITH THE ERROR
	}

	c.JSON(http.StatusOK, &processResponse{
		Id:        request.Id + "-" + key,
		CreatedAt: time.Now().UTC(),
		Status:    "foo:" + request.From.Format(time.RFC3339) + "__" + request.To.Format(time.RFC3339),
	})
}
