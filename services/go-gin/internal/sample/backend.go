package sample

import (
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"sample-micro-service/pkg/service/config"
	"strconv"
	"time"
)

type Opera struct {
	Id           string     `json:"id"`
	Name         string     `json:"name"`
	Composer     string     `json:"composer"`
	ComposedAt   time.Time  `json:"composed_at"`
	PublishedAt  *time.Time `json:"published_at"`
	Description  *string    `json:"description"`
	NumberOfActs int        `json:"number_of_acts"`
	Style        *string    `json:"style"`
	OpenAir      bool       `json:"open_air"`
}

type Planet struct {
	Id           string    `json:"id"`
	Name         string    `json:"name"`
	Diameter     int       `json:"diameter"`
	Orbit        int       `json:"orbit"`
	Gas          bool      `json:"gas"`
	DiscoveredAt time.Time `json:"discovered_at"`
	DiscoveredBy string    `json:"discovered_by"`
	History      *string   `json:"history"`
	Missions     []string  `json:"missions"`
	Moons        []Moon    `json:"moons"`
}

type Moon struct {
	Name         string     `json:"name"`
	Diameter     int        `json:"diameter"`
	Distance     int        `json:"distance"`
	DiscoveredAt *time.Time `json:"discovered_at"`
	DiscoveredBy *string    `json:"discovered_by"`
	PossibleLife bool       `json:"possible_life"`
}

type Journal struct {
	Id          string     `json:"id"`
	Name        string     `json:"name"`
	Title       string     `json:"title"`
	Issue       int        `json:"issue"`
	Publisher   *string    `json:"publisher"`
	PublishedAt *time.Time `json:"published_at"`
	Editors     []string   `json:"editors"`
	Url         *string    `json:"url"`
	Articles    []Article  `json:"articles"`
}

type Article struct {
	Title         string     `json:"title"`
	Description   string     `json:"description"`
	Authors       []string   `json:"authors"`
	Keywords      []string   `json:"keywords"`
	FromPage      *int       `json:"from_page"`
	ToPage        *int       `json:"to_page"`
	LastUpdatedAt *time.Time `json:"last_updated_at"`
	Sections      []Section  `json:"sections"`
}

type Section struct {
	Title         string     `json:"title"`
	Summary       string     `json:"summary"`
	Words         int        `json:"words"`
	LastUpdatedAt *time.Time `json:"last_updated_at"`
}

var (
	fetchUrl    = config.GetString("backend.fetch.url") + "/api/fetch"
	pushUrl     = config.GetString("backend.push.url") + "/api/push"
	httpTimeout = time.Duration(config.GetOptionalInt("backend.timeout-ms", 5_000)) * time.Millisecond

	httpTransport = &http.Transport{
		MaxIdleConns:       10,
		IdleConnTimeout:    30 * time.Second,
		DisableCompression: true,
	}
	httpClient = &http.Client{
		Transport: httpTransport,
		Timeout:   httpTimeout,
	}
)

func fetchSmall(c *gin.Context, userToken string, id string) (Opera, bool) {
	return getRequest(c, fetchUrl+"/"+id+"/small", userToken, Opera{})
}

func fetchMedium(c *gin.Context, userToken string, id string) (Planet, bool) {
	return getRequest(c, fetchUrl+"/"+id+"/medium", userToken, Planet{})
}

func fetchLarge(c *gin.Context, userToken string, id string) (Journal, bool) {
	return getRequest(c, fetchUrl+"/"+id+"/large", userToken, Journal{})
}

func pushSmall(c *gin.Context, userToken string, id string, body Opera) (Opera, bool) {
	return postRequest(c, pushUrl+"/"+id+"/small", userToken, body, Opera{})
}

func pushMedium(c *gin.Context, userToken string, id string, body Planet) (Planet, bool) {
	return postRequest(c, pushUrl+"/"+id+"/medium", userToken, body, Planet{})
}

func pushLarge(c *gin.Context, userToken string, id string, body Journal) (Journal, bool) {
	return postRequest(c, pushUrl+"/"+id+"/large", userToken, body, Journal{})
}

func getRequest[R any](c *gin.Context, url string, userToken string, defaultResult R) (R, bool) {
	req, err := http.NewRequestWithContext(c, "GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+userToken)

	resp, err := httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadGateway, Error{Message: strconv.Itoa(resp.StatusCode)})
		return defaultResult, false
	}

	var parsedResponse R
	err = json.NewDecoder(resp.Body).Decode(&parsedResponse)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}

	return parsedResponse, true
}

func postRequest[R any](c *gin.Context, url string, userToken string, body R, defaultResult R) (R, bool) {
	serializedBody := new(bytes.Buffer)
	err := json.NewEncoder(serializedBody).Encode(body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}
	req, err := http.NewRequestWithContext(c, "POST", url, serializedBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+userToken)

	resp, err := httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadGateway, Error{Message: strconv.Itoa(resp.StatusCode)})
		return defaultResult, false
	}

	var parsedResponse R
	err = json.NewDecoder(resp.Body).Decode(&parsedResponse)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Message: err.Error()})
		return defaultResult, false
	}

	return parsedResponse, true
}
