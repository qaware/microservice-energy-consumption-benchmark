use chrono::NaiveDateTime;
use sqlx::Error;

use crate::shared::database::Database;

#[derive(sqlx::FromRow)]
pub struct StoredItem {
    pub id:  String,
    pub title: String ,
    pub description: String ,
    pub status: String ,
    pub color: String ,
    pub iteration: i64 ,
    pub updated_at: NaiveDateTime,
}

#[derive(sqlx::FromRow)]
pub struct StoredPreview {
    pub id:  String,
    pub data: String ,
    pub created_at: NaiveDateTime,
}

pub async fn get_stored_items(db: &Database, user_id: String, from: Option<String>, limit: i32) -> Result<Vec<StoredItem>, Error> {
    if from.is_none() {
        sqlx::query_as::<_, StoredItem>(
            "SELECT id, title, description, status, color, iteration, updated_at FROM rust.items WHERE user_id = $1 ORDER BY id LIMIT $2")
            .bind(user_id)
            .bind(limit)
            .fetch_all(&db.pool)
            .await
    } else {
        sqlx::query_as::<_, StoredItem>(
            "SELECT id, title, description, status, color, iteration, updated_at FROM rust.items WHERE user_id = $1 AND id >= $2 ORDER BY id LIMIT $3")
            .bind(user_id)
            .bind(from.unwrap())
            .bind(limit)
            .fetch_all(&db.pool)
            .await
    }
}

pub async fn get_stored_item(db: &Database, user_id: String, item_id: String) -> Result<Option<StoredItem>, Error> {
    sqlx::query_as::<_, StoredItem>(
        "SELECT id, title, description, status, color, iteration, updated_at FROM rust.items WHERE user_id = $1 AND id = $2")
        .bind(user_id)
        .bind(item_id)
        .fetch_optional(&db.pool)
        .await
}

pub async fn get_stored_previews(db: &Database, item_id: String) -> Result<Vec<StoredPreview>, Error> {
    sqlx::query_as::<_, StoredPreview>(
        "SELECT id, data, created_at FROM rust.previews WHERE item_id = $1")
        .bind(item_id)
        .fetch_all(&db.pool)
        .await
}
