package sample

import (
	"context"
	"encoding/json"
	"net/http"
	"sample-micro-service/pkg/service/config"
	"time"
)

type ExternalStepList struct {
	Steps []ExternalStep `json:"steps"`
}

type ExternalStep struct {
	Id           string   `json:"id"`
	Name         string   `json:"name"`
	Labels       []string `json:"labels"`
	DurationInMs int      `json:"durationInMs"`
}

var (
	httpUrl     = config.GetString("steps.url") + "/api/items"
	httpTimeout = time.Duration(config.GetOptionalInt("steps.timeout-ms", 5_000)) * time.Millisecond

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

func getSteps(c context.Context, userToken string, itemId string) (ExternalStepList, int, error) {
	req, err := http.NewRequestWithContext(c, "GET", httpUrl+"/"+itemId+"/steps", nil)
	if err != nil {
		return ExternalStepList{}, http.StatusInternalServerError, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+userToken)

	resp, err := httpClient.Do(req)
	if err != nil {
		return ExternalStepList{}, http.StatusInternalServerError, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ExternalStepList{}, http.StatusBadGateway, nil
	}

	var parsedResponse ExternalStepList
	err = json.NewDecoder(resp.Body).Decode(&parsedResponse)
	if err != nil {
		return ExternalStepList{}, http.StatusInternalServerError, err
	}

	return parsedResponse, http.StatusOK, nil
}
