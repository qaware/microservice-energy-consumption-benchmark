package sample

import "time"

type Error struct {
	Message string `json:"message"`
}

type OverviewItem struct {
	Id          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Color       string    `json:"color"`
	Iteration   int       `json:"iteration"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type OverviewItemList struct {
	Items []OverviewItem `json:"items"`
	Next  *string        `json:"next"`
}

type DetailItem struct {
	Id          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Color       string    `json:"color"`
	Iteration   int       `json:"iteration"`
	Previews    []Preview `json:"previews"`
	Steps       []Step    `json:"steps"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Preview struct {
	Id        string    `json:"id"`
	Data      string    `json:"data"`
	CreatedAt time.Time `json:"created_at"`
}

type Step struct {
	Name         string   `json:"name"`
	Labels       []string `json:"labels"`
	DurationInMs int      `json:"duration_in_ms"`
}
