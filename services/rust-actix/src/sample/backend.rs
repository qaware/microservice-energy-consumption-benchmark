use std::time::Duration;

use actix_web::HttpResponse;
use chrono::{DateTime, Utc};
use reqwest::{Client, Response};
use serde::{Deserialize, Serialize};

use crate::sample::error::ErrorResponse;

#[derive(Serialize, Deserialize)]
pub struct Opera {
    pub id: String,
    pub name: String,
    pub composer: String,
    pub composed_at: DateTime<Utc>,
    pub published_at: Option<DateTime<Utc>>,
    pub description: Option<String>,
    pub number_of_acts: u64,
    pub style: Option<String>,
    pub open_air: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Planet {
    pub id: String,
    pub name: String,
    pub diameter: u64,
    pub orbit: u64,
    pub gas: bool,
    pub discovered_at: DateTime<Utc>,
    pub discovered_by: String,
    pub history: Option<String>,
    pub missions: Option<Vec<String>>,
    pub moons: Vec<Moon>,
}

#[derive(Serialize, Deserialize)]
pub struct Moon {
    pub name: String,
    pub diameter: u64,
    pub distance: u64,
    pub discovered_at: Option<DateTime<Utc>>,
    pub discovered_by: Option<String>,
    pub possible_life: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Journal {
    pub id: String,
    pub name: String,
    pub title: String,
    pub issue: u64,
    pub publisher: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub editors: Option<Vec<String>>,
    pub url: Option<String>,
    pub articles: Vec<Article>,
}

#[derive(Serialize, Deserialize)]
pub struct Article {
    pub title: String,
    pub description: String,
    pub authors: Vec<String>,
    pub keywords: Option<Vec<String>>,
    pub from_page: Option<u64>,
    pub to_page: Option<u64>,
    pub last_updated_at: Option<DateTime<Utc>>,
    pub sections: Option<Vec<Section>>,
}

#[derive(Serialize, Deserialize)]
pub struct Section {
    pub title: String,
    pub summary: String,
    pub words: u64,
    pub last_updated_at: Option<DateTime<Utc>>,
}

#[derive(Clone)]
pub struct BackendClient {
    inner: Client,
}

pub fn build_backend_client() -> reqwest::Result<BackendClient> {
    Client::builder()
        .timeout(Duration::from_millis(2_000))
        .build()
        .map(|c| BackendClient { inner: c })
}

impl BackendClient {
    pub async fn fetch_small(&self, user_token: &str, id: &str) -> Result<Opera, HttpResponse> {
        self.fetch("small", user_token, id).await
    }

    pub async fn fetch_medium(&self, user_token: &str, id: &str) -> Result<Planet, HttpResponse> {
        self.fetch("medium", user_token, id).await
    }

    pub async fn fetch_large(&self, user_token: &str, id: &str) -> Result<Journal, HttpResponse> {
        self.fetch("large", user_token, id).await
    }

    pub async fn push_small(&self, user_token: &str, id: &str, body: Opera) -> Result<Opera, HttpResponse> {
        self.push("small", user_token, id, body).await
    }

    pub async fn push_medium(&self, user_token: &str, id: &str, body: Planet) -> Result<Planet, HttpResponse> {
        self.push("medium", user_token, id, body).await
    }

    pub async fn push_large(&self, user_token: &str, id: &str, body: Journal) -> Result<Journal, HttpResponse> {
        self.push("large", user_token, id, body).await
    }

    async fn fetch<T: for<'a> Deserialize<'a>>(&self, path: &str, user_token: &str, id: &str) -> Result<T, HttpResponse> {
        let base_url = std::env::var("BACKEND_FETCH_URL")
            .expect("BACKEND_FETCH_URL must be set");

        BackendClient::wrap_response(self.inner.get(format!("{}/api/fetch/{}/{}", base_url, id, path))
            .bearer_auth(user_token)
            .send()
            .await).await
    }

    async fn push<T: for<'a> Deserialize<'a>, U: Serialize>(&self, path: &str, user_token: &str, id: &str, body: U) -> Result<T, HttpResponse> {
        let base_url = std::env::var("BACKEND_PUSH_URL")
            .expect("BACKEND_PUSH_URL must be set");

        BackendClient::wrap_response(self.inner.post(format!("{}/api/push/{}/{}", base_url, id, path))
            .bearer_auth(user_token)
            .json(&body)
            .send()
            .await).await
    }

    async fn wrap_response<T: for<'a> Deserialize<'a>>(result: reqwest::Result<Response>) -> Result<T, HttpResponse> {
        if let Err(e) = result {
            return Err(HttpResponse::BadGateway().json(ErrorResponse { message: e.to_string() }));
        }
        let response = result.unwrap();

        if response.status() != 200 {
            return Err(HttpResponse::BadGateway().json(ErrorResponse { message: response.status().to_string() }));
        }

        match response.json::<T>().await {
            Err(e) => Err(HttpResponse::BadGateway().json(ErrorResponse { message: e.to_string() })),
            Ok(body) => Ok(body),
        }
    }
}
