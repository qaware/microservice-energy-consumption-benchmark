use std::time::Duration;
use sqlx::error::Error;
use sqlx::PgPool;
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};

#[derive(Clone)]
pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new() -> Result<Database, Error> {

        let p = PgPoolOptions::new()
            .min_connections(2)
            .max_connections(20)
            .acquire_timeout(Duration::from_secs(10))
            .idle_timeout(Duration::from_secs(5 * 60))
            .max_lifetime(Duration::from_secs(12 * 3600))
            .connect_with(PgConnectOptions::new()
                .host(std::env::var("DB_HOST").expect("DB_HOST must be set").as_str())
                .port(std::env::var("DB_PORT").expect("DB_PORT must be set").parse().unwrap())
                .database(std::env::var("DB_NAME").expect("DB_NAME must be set").as_str())
                .username(std::env::var("DB_USER").expect("DB_USER must be set").as_str())
                .password(std::env::var("DB_PASSWORD").expect("DB_PASSWORD must be set").as_str()))
            .await?;

        Ok(Database { pool: p })
    }
}
