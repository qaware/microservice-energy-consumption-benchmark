use actix_web::{web, HttpResponse, Responder};
use serde::Serialize;

#[derive(Serialize)]
pub struct Health {
    status: HealthStatus,
    checks: Vec<HealthCheck>,
}

#[derive(Serialize)]
pub struct HealthCheck {
    name: String,
    status: HealthStatus,
}

#[derive(Serialize)]
pub enum HealthStatus {
    UP,
    // TODO: DOWN,
}

async fn endpoint() -> impl Responder {
    HttpResponse::Ok().json(Health {
        status: HealthStatus::UP,
        checks: vec![],
    })
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(endpoint)).service(
        web::scope("/health")
            .route("/started", web::get().to(endpoint))
            .route("/ready", web::get().to(endpoint))
            .route("/live", web::get().to(endpoint)),
    );
}
