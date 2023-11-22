use actix_web::{App, HttpServer, web};
use actix_web::web::Data;

use crate::shared::database::Database;

mod sample;
mod shared;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // TODO
    // std::env::set_var("RUST_LOG", "debug");
    // env_logger::init();

    let db = Database::new().await.expect("database setup should work");
    let steps_client = sample::steps::build_steps_client().expect("steps client should be available");

    let server = HttpServer::new(move || {
        App::new()
            .configure(shared::health::config)
            // TODO: metrics
            .service(
                web::scope("/api/sample")
                    .app_data(Data::new(db.clone()))
                    .app_data(Data::new(steps_client.clone()))
                    .configure(sample::resource::config),
            )
    });

    println!("Starting the service");  // TODO: use JSON logging

    server.bind("0.0.0.0:8080")?.run().await
}
