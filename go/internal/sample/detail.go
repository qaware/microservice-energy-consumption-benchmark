package sample

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"sample-micro-service/pkg/service/auth"
	"time"
)

func Details(c *gin.Context) {
	userId := c.GetString(auth.UserId)
	itemId := c.Param("id")

	item, err := getItemForUser(c, userId, itemId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return
	}
	if item == nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	previews, err := getPreviewsForItem(c, itemId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return
	}

	steps, status, err := getSteps(c, c.GetString(auth.RawToken), itemId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return
	}
	if status != http.StatusOK {
		c.JSON(status, Error{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, DetailItem{
		Id:          item.id,
		Title:       item.title,
		Description: item.description,
		Status:      item.status,
		Color:       item.color,
		Iteration:   item.iteration,
		Previews:    mapSlice(previews, mapPreview),
		Steps:       mapSlice(steps.Steps, mapStep),
		UpdatedAt:   time.Time{},
	})
}

func mapPreview(preview storedPreview) Preview {
	return Preview{
		Id:        preview.id,
		Data:      preview.data,
		CreatedAt: preview.createdAt,
	}
}

func mapStep(step ExternalStep) Step {
	return Step{
		Name:         step.Name,
		Labels:       step.Labels,
		DurationInMs: step.DurationInMs,
	}
}
