use std::time::Duration;

use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct ExternalStepList {
    pub steps: Vec<ExternalStep>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExternalStep {
    id: String,
    pub name: String,
    pub labels: Vec<String>,
    #[serde(rename = "durationInMs")]
    pub duration_in_ms: i32,
}

pub async fn get_steps(user_token: String, item_id: String) -> reqwest::Result<(StatusCode, Vec<ExternalStep>)> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_millis(2_000))
        .build()
        .unwrap();

    let base_url = std::env::var("STEPS_URL").expect("STEPS_URL must be set");

    let response = client.get(format!("{}/api/items/{}/steps", base_url, item_id))
        .bearer_auth(user_token)
        .send()
        .await?;
    let status = response.status();
    let mut external_steps = vec![];

    if status == 200 {
        external_steps = response.json::<ExternalStepList>().await?.steps;
    }
    Ok((status, external_steps))
}