package sample

import (
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
	"sample-micro-service/pkg/service/auth"
	"strconv"
)

func Overview(c *gin.Context) {
	userId := c.GetString(auth.UserId)
	fromId := c.Query("from")
	limit, err := strconv.ParseInt(c.DefaultQuery("limit", "10"), 10, 16)
	if err != nil {
		c.JSON(http.StatusBadRequest, Error{Message: err.Error()})
		return
	}

	storedItems, err := getStoredItems(c, userId, fromId, int(limit+1))
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return
	}

	overviewItems := mapSlice(storedItems, func(item storedItem) OverviewItem {
		return OverviewItem{
			Id:          item.id,
			Title:       item.title,
			Description: item.description,
			Status:      item.status,
			Color:       item.color,
			Iteration:   item.iteration,
			UpdatedAt:   item.updatedAt,
		}
	})

	c.JSON(http.StatusOK, OverviewItemList{
		Items: overviewItems[:min(len(overviewItems), int(limit))],
		Next:  getNextId(overviewItems, int(limit)),
	})
}

func getStoredItems(c context.Context, userId string, fromId string, limit int) ([]storedItem, error) {
	if fromId == "" {
		return getItemsForUser(c, userId, limit)
	} else {
		return getItemsForUserFromId(c, userId, fromId, limit)
	}
}

func getNextId(items []OverviewItem, limit int) *string {
	if len(items) > limit {
		return &items[limit].Id
	}
	return nil
}
