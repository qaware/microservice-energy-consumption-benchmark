use std::time::Duration;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
// use log::info;
use rocket::serde::{Deserialize, json::Json, Serialize};
use rocket::State;

use crate::database::Database;

#[derive(Serialize, Deserialize)]
pub struct DataPoint {
    id: String,
    created_at: DateTime<Utc>,
    text: String,
}

#[derive(sqlx::FromRow)]
struct StoredData {
    id: String,
    created_at: NaiveDateTime,
    description: String,
}

impl StoredData {
    fn new(id: &str, description: &str) -> StoredData {
        StoredData {
            id: id.to_owned(),
            created_at: Utc::now().naive_utc(),
            description: description.to_owned(),
        }
    }
}

#[derive(Serialize, Deserialize)]
struct ExternalData {
    id: String,
    created_at: DateTime<Utc>,
    payload: String,
}

#[rocket::get("/<id>")]
pub async fn get_data_for_id(id: &str, db: &State<Database>) -> Json<DataPoint> {
    let d = sqlx::query_as::<_, StoredData>(
        "SELECT * FROM data WHERE id = $1")
        .bind(id)
        .fetch_optional(&db.pool)
        .await
        .unwrap_or_else(|e| Some(StoredData::new(id, format!("##error## {}", e).as_str())))
        .unwrap_or(StoredData::new(id, "##missing##"));

    Json(DataPoint {
        id: d.id,
        created_at: Utc.from_utc_datetime(&d.created_at),
        text: d.description,
    })
}

#[rocket::put("/<id>", data = "<request>")]
pub async fn put_data_for_id(id: &str, request: Json<DataPoint>, db: &State<Database>) -> Json<DataPoint> {
    // info!("Processing request {} ...", id);

    let client = reqwest::Client::builder()
        .connection_verbose(true)
        .timeout(Duration::from_millis(2_000))
        .build()
        .unwrap();

    let ext = client.get(format!("http://rust-wiremock-server:8888/external/data/{}", id))
        .send()
        .await.unwrap()
        .json::<ExternalData>()
        .await.unwrap();

    let created_at = if request.created_at > ext.created_at { request.created_at } else { ext.created_at };

    let sd = StoredData {
        id: id.to_owned(),
        created_at: created_at.naive_utc(),
        description: format!("{} -- {}", request.text, ext.payload),
    };

    sqlx::query(
        "INSERT INTO data (id, created_at, description) VALUES ($1, $2, $3) \
        ON CONFLICT (id) DO UPDATE SET created_at = EXCLUDED.created_at, description = EXCLUDED.description")
        .bind(&sd.id)
        .bind(&sd.created_at)
        .bind(&sd.description)
        .execute(&db.pool)
        .await
        .unwrap(); // TODO

    Json(DataPoint {
        id: sd.id,
        created_at,
        text: sd.description,
    })
}
