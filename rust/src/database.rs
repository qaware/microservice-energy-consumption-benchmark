// use std::path::Path;
// use std::time::Duration;

use figment::{Figment, providers::Env};
use serde::Deserialize;
use sqlx::error::Error;
//use sqlx::migrate::{MigrateError, Migrator};
use sqlx::PgPool;
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};

#[derive(Deserialize)]
struct Config {
    host: String,
    port: u16,
    name: String,
    username: String,
    password: String,
//    connections: Connections,
//    timeouts: Timeouts,
}
/*
#[derive(Deserialize)]
struct Connections {
    min: u32,
    max: u32,
}

impl Default for Connections {
    fn default() -> Self {
        Connections { min: 0, max: 10 }
    }
}

#[derive(Deserialize)]
struct Timeouts {
    acquire: u64,
    idle: u64,
    lifetime: u64,
}

impl Default for Timeouts {
    fn default() -> Self {
        Timeouts {
            acquire: 1_000,
            idle: 30_000,
            lifetime: 5 * 3_600 * 1_000,
        }
    }
}
*/
pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new() -> Result<Database, Error> {
        let figment = Figment::new()
            .merge(Env::prefixed("APP_DATABASE_"));

        let config: Config = figment.extract().unwrap(); // TODO

        let p = PgPoolOptions::new()
            /* TODO
            .min_connections(config.connections.min)
            .max_connections(config.connections.max)
            .acquire_timeout(Duration::from_millis(config.timeouts.acquire))
            .idle_timeout(Duration::from_secs(config.timeouts.idle))
            .max_lifetime(Duration::from_secs(config.timeouts.lifetime))
             */
            .connect_with(PgConnectOptions::new()
                .host(config.host.as_str())
                .port(config.port)
                .database(config.name.as_str())
                .username(config.username.as_str())
                .password(config.password.as_str()))
            .await?;

        Ok(Database { pool: p })
    }
/*
    pub async fn migrate(&self) -> Result<(), MigrateError> {
        let paths = std::fs::read_dir("/app/migrations").unwrap();

        for path in paths {
            println!("Name: {}", path.unwrap().path().display())
        }

        let migrator = Migrator::new(Path::new("/app/migrations")).await?;

        println!("migrations: {:#?}", migrator);

        migrator.run(&self.pool).await
    }
*/
}
