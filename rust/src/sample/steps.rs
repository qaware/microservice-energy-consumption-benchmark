use std::time::Duration;

use reqwest::{Client, StatusCode};
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

#[derive(Clone)]
pub struct StepsClient {
    inner: Client,
}

pub fn build_steps_client() -> reqwest::Result<StepsClient> {
    Client::builder()
        .timeout(Duration::from_millis(2_000))
        .build()
        .map(|c| StepsClient{inner: c})
}

pub async fn get_steps(client: &StepsClient, user_token: String, item_id: String) -> reqwest::Result<(StatusCode, Vec<ExternalStep>)> {
    let base_url = std::env::var("STEPS_URL").expect("STEPS_URL must be set");

    let response = client.inner.get(format!("{}/api/items/{}/steps", base_url, item_id))
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