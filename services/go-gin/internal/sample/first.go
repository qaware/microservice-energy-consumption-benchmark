package sample

import (
	"crypto/md5"
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"sample-micro-service/pkg/service/auth"
	"strconv"
	"time"
)

type FirstResponse struct {
	Id                 string      `json:"id"`
	Hash               string      `json:"hash"`
	Version            string      `json:"version"`
	Url                *string     `json:"url"`
	TotalNumberOfItems int         `json:"total_number_of_items"`
	SelectedItems      []FirstItem `json:"selected_items"`
}

type FirstItem struct {
	Name      string     `json:"name"`
	Tags      []string   `json:"tags"`
	Length    *int       `json:"length"`
	CreatedAt *time.Time `json:"created_at"`
}

func First(c *gin.Context) {
	userId := c.GetString(auth.UserId)
	id := c.Param("id")

	journal, success := fetchLarge(c, c.GetString(auth.RawToken), userId+"++"+id)
	if !success {
		return
	}

	articles := copySlice(journal.Articles)
	sortSlice(articles, func(a Article) string { return a.Title }, lt)
	var items []FirstItem
	for _, article := range articles[:min(5, len(articles))] {
		tags := copySlice(article.Authors)
		sortSlice(tags, func(s string) string { return s }, lt)
		items = append(items, FirstItem{
			Name:      article.Title,
			Tags:      tags,
			Length:    diff(article.FromPage, article.ToPage),
			CreatedAt: article.LastUpdatedAt,
		})
	}

	hash := md5.New()
	_, _ = io.WriteString(hash, journal.Title)
	for _, e := range journal.Editors {
		_, _ = io.WriteString(hash, e)
	}

	total := 0
	for _, article := range journal.Articles {
		for _, section := range article.Sections {
			total += section.Words
		}
	}

	c.JSON(http.StatusOK, FirstResponse{
		Id:                 journal.Id,
		Hash:               base64.StdEncoding.EncodeToString(hash.Sum(nil)),
		Version:            strconv.Itoa(journal.Issue),
		Url:                journal.Url,
		TotalNumberOfItems: total,
		SelectedItems:      items,
	})
}

func diff(from, to *int) *int {
	if from == nil && to == nil {
		return nil
	}
	f := defaultInt(from)
	t := defaultInt(to)
	d := f - t
	if d < 0 {
		d = -d
	}
	return &d
}
