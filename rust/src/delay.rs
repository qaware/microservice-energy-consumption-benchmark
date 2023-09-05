use log::debug;
use rocket::serde::json::Json;
use rocket::tokio::time::{Duration, sleep};
use serde::Serialize;

#[derive(Serialize)]
pub struct Delay {
    seconds: u64,
}

#[rocket::get("/<seconds_to_wait>")]
pub async fn delay(seconds_to_wait: u64) -> Json<Delay> {
    sleep(Duration::from_secs(seconds_to_wait)).await;
    debug!("Waited for {} seconds", seconds_to_wait);

    Json(Delay { seconds: seconds_to_wait })
}
