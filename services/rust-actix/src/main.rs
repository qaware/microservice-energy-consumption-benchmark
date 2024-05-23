use actix_web::{App, HttpServer, web};
use actix_web::web::Data;

mod sample;
mod shared;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let backend_client = sample::backend::build_backend_client()
        .expect("backend client should be available");

    let server = HttpServer::new(move || {
        App::new()
            .configure(shared::health::config)
            // TODO: metrics
            .service(
                web::scope("/api/sample")
                    .app_data(Data::new(backend_client.clone()))
                    .configure(sample::resource::config),
            )
    });

    println!("Starting the service");  // TODO: use JSON logging

    server.bind("0.0.0.0:8080")?.run().await
}
