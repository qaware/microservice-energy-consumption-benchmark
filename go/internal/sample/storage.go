package sample

import (
	"context"
	"database/sql"
	"errors"
	"sample-micro-service/pkg/service/database"
	"time"
)

type storedItem struct {
	id          string
	title       string
	description string
	status      string
	color       string
	iteration   int
	updatedAt   time.Time
}

type storedPreview struct {
	id        string
	data      string
	createdAt time.Time
}

func getItemsForUser(c context.Context, userId string, limit int) ([]storedItem, error) {
	rows, err := database.Db.QueryContext(c, "SELECT id, title, description, status, color, iteration, updated_at FROM go.items WHERE user_id = $1 ORDER BY id LIMIT $2", userId, limit)
	if err != nil {
		return make([]storedItem, 0), err
	}
	return fetchItems(rows)
}

func getItemsForUserFromId(c context.Context, userId string, fromId string, limit int) ([]storedItem, error) {
	rows, err := database.Db.QueryContext(c, "SELECT id, title, description, status, color, iteration, updated_at FROM go.items WHERE user_id = $1 AND id >= $2 ORDER BY id LIMIT $3", userId, fromId, limit)
	if err != nil {
		return make([]storedItem, 0), err
	}
	return fetchItems(rows)
}

func getItemForUser(c context.Context, userId string, itemId string) (*storedItem, error) {
	rows, err := database.Db.QueryContext(c, "SELECT id, title, description, status, color, iteration, updated_at FROM go.items WHERE user_id = $1 AND id = $2", userId, itemId)
	if err != nil {
		return nil, err
	}

	items, err := fetchItems(rows)
	if err != nil {
		return nil, err
	}

	if len(items) > 1 {
		return nil, errors.New("Too many items for " + itemId)
	}
	if len(items) < 1 {
		return nil, errors.New("Too few items for " + itemId)
	}
	return &items[0], nil
}

func getPreviewsForItem(c context.Context, itemId string) (result []storedPreview, err error) {
	result = make([]storedPreview, 0)

	rows, err := database.Db.QueryContext(c, "SELECT id, data, created_at FROM go.previews WHERE item_id = $1", itemId)
	if err != nil {
		return
	}

	for rows.Next() {
		var preview storedPreview
		err = rows.Scan(&preview.id, &preview.data, &preview.createdAt)
		if err != nil {
			return
		}
		result = append(result, preview)
	}
	return
}

func fetchItems(rows *sql.Rows) (result []storedItem, err error) {
	result = make([]storedItem, 0)

	for rows.Next() {
		var item storedItem
		err = rows.Scan(&item.id, &item.title, &item.description, &item.status, &item.color, &item.iteration, &item.updatedAt)
		if err != nil {
			return
		}
		result = append(result, item)
	}
	return
}
