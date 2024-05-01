package sample

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "sample-micro-service/pkg/service/auth"
    "time"
)

type ThirdRequest struct {
    Value     string    `json:"value"`
    Count     int       `json:"count"`
    Timestamp time.Time `json:"timestamp"`
}

type ThirdResponse struct {
    Name          string      `json:"name"`
    Description   string      `json:"description"`
    CreatedAt     *time.Time  `json:"created_at"`
    LastUpdatedAt time.Time   `json:"last_updated_at"`
    Labels        []string    `json:"labels"`
    TotalCount    int         `json:"total_count"`
    Items         []ThirdItem `json:"items"`
}

type ThirdItem struct {
    Details   string     `json:"details"`
    Steps     []string   `json:"steps"`
    Contents  []string   `json:"contents"`
    Timestamp *time.Time `json:"timestamp"`
}

func Third(c *gin.Context) {
    userId := c.GetString(auth.UserId)
    userToken := c.GetString(auth.RawToken)
    id := c.Param("id")

    var req ThirdRequest
    if err := c.BindJSON(&req); err != nil {
        return
    }

    result1, success := pushSmall(c, userToken, "a.10:"+id, Opera{
        Id:           "",
        Name:         "first " + req.Value,
        Composer:     "",
        ComposedAt:   req.Timestamp,
        PublishedAt:  nil,
        Description:  nil,
        NumberOfActs: 10,
        Style:        nil,
        OpenAir:      false,
    })
    if !success {
        return
    }

    result2, success := pushSmall(c, userToken, "a.20:"+id, Opera{
        Name:         "second " + req.Value,
        ComposedAt:   req.Timestamp,
        NumberOfActs: 20,
    })
    if !success {
        return
    }

    journal, success := pushLarge(c, userToken, userId+"++xg.3.f4:"+id, Journal{
        Name:  req.Value,
        Issue: req.Count,
        Articles: []Article{
            {
                Title:         result1.Name,
                LastUpdatedAt: &result1.ComposedAt,
            },
            {
                Title:         result2.Name,
                LastUpdatedAt: &result2.ComposedAt,
            },
        },
    })
    if !success {
        return
    }

    var lastUpdatedAt time.Time
    var found bool
    for _, article := range journal.Articles {
        if article.LastUpdatedAt != nil && article.LastUpdatedAt.After(lastUpdatedAt) {
            lastUpdatedAt = *article.LastUpdatedAt
            found = true
        }
    }
    if !found {
        lastUpdatedAt = time.Now()
    }

    labels := mapSlice(journal.Editors, func(editor string) string { return "- " + editor })

    var totalCount int
    for _, article := range journal.Articles {
        totalCount += len(article.Sections)
    }

    items := mapSlice(journal.Articles, func(article Article) ThirdItem {
        return ThirdItem{
            Details: article.Description,
            Steps:   article.Authors,
            Contents: mapSlice(article.Sections, func(section Section) string {
                return section.Summary
            }),
            Timestamp: article.LastUpdatedAt,
        }
    })

    c.JSON(http.StatusOK, ThirdResponse{
        Name:          journal.Name,
        Description:   journal.Title + " " + defaultString(journal.Publisher) + " " + defaultString(journal.Url),
        CreatedAt:     journal.PublishedAt,
        LastUpdatedAt: lastUpdatedAt,
        Labels:        labels,
        TotalCount:    totalCount,
        Items:         items,
    })

}
