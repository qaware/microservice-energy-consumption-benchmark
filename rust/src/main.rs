#[macro_use]
extern crate rocket;

use rocket::{Build, Rocket};
use rocket::serde::{json::Json, Serialize};
use rocket::tokio::time::{Duration, sleep};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct HealthCheck<'a> {
    status: &'a str,
}

#[get("/started")]
fn health_started() -> Json<HealthCheck<'static>> {
    Json(HealthCheck { status: "OK" })
}

#[get("/live")]
fn health_live() -> Json<HealthCheck<'static>> {
    Json(HealthCheck { status: "OK" })
}

#[get("/ready")]
fn health_ready() -> Json<HealthCheck<'static>> {
    Json(HealthCheck { status: "OK" })
}

#[get("/hello")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/delay/<seconds>")]
async fn delay(seconds: u64) -> String {
    sleep(Duration::from_secs(seconds)).await;
    format!("Waited for {} seconds", seconds)
}

#[launch]
fn rocket() -> Rocket<Build> {
    rocket::build()
        .mount("/health", routes![health_started, health_live, health_ready])
        .mount("/api/sample", routes![index, delay])
}