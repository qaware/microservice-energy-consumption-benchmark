use rocket::serde::{json::Json};
use serde::{Serialize};

#[derive(Serialize)]
pub struct HealthCheck {
    status: String,
}

#[rocket::get("/started")]
pub fn started() -> Json<HealthCheck> {
    Json(HealthCheck { status: String::from("OK") })
}

#[rocket::get("/live")]
pub fn live() -> Json<HealthCheck> {
    Json(HealthCheck { status: String::from("OK") })
}

#[rocket::get("/ready")]
pub fn ready() -> Json<HealthCheck> {
    Json(HealthCheck { status: String::from("OK") })
}
