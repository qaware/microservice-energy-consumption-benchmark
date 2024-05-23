package sample

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"sample-micro-service/pkg/service/auth"
	"strings"
	"time"
)

type SecondResponse struct {
	Relevant    bool         `json:"relevant"`
	Omit        bool         `json:"omit"`
	Description string       `json:"description"`
	Weight      int          `json:"weight"`
	Items       []SecondItem `json:"items"`
}

type SecondItem struct {
	Name      string    `json:"name"`
	Details   *string   `json:"details"`
	Timestamp time.Time `json:"timestamp"`
	Count     int       `json:"count"`
}

func Second(c *gin.Context) {
	userId := c.GetString(auth.UserId)
	userToken := c.GetString(auth.RawToken)
	id := c.Param("id")

	planet, success := fetchMedium(c, userToken, userId+"++sec-"+id)
	if !success {
		return
	}
	name1 := getName(planet.Moons, 0)
	name2 := getName(planet.Moons, 1)
	name3 := getName(planet.Moons, 2)

	opera1, success := fetchSmall(c, userToken, "foo_"+name1)
	if !success {
		return
	}
	opera2, success := fetchSmall(c, userToken, "bar_"+name2)
	if !success {
		return
	}
	opera3, success := fetchSmall(c, userToken, "quz_"+name3)
	if !success {
		return
	}

	relevant := false
	for _, mission := range planet.Missions {
		if strings.Contains(mission, "f") {
			relevant = true
			break
		}
	}

	description := ""
	for _, moon := range planet.Moons {
		if len(description) > 0 {
			description += "--"
		}
		description += moon.Name
	}

	c.JSON(http.StatusOK, SecondResponse{
		Relevant:    relevant,
		Omit:        !planet.Gas,
		Description: description,
		Weight:      planet.Diameter + planet.Orbit,
		Items: []SecondItem{
			{
				Name:      name1,
				Details:   opera1.Style,
				Timestamp: opera1.ComposedAt,
				Count:     opera1.NumberOfActs,
			},
			{
				Name:      name2,
				Details:   opera2.Style,
				Timestamp: opera2.ComposedAt,
				Count:     opera2.NumberOfActs,
			},
			{
				Name:      name3,
				Details:   opera3.Style,
				Timestamp: opera3.ComposedAt,
				Count:     opera3.NumberOfActs,
			},
		},
	})
}

func getName(moons []Moon, index int) string {
	if index >= len(moons) {
		return "(none)"
	}
	return moons[index].Name
}
