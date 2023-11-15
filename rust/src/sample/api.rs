use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct OverviewItem {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub color: String,
    pub iteration: i32,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct OverviewItemList {
    pub items: Vec<OverviewItem>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DetailItem {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub color: String,
    pub iteration: i32,
    pub previews: Vec<Preview>,
    pub steps: Vec<Step>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct Preview {
    pub id: String,
    pub data: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct Step {
    pub name: String,
    pub labels: Vec<String>,
    pub duration_in_ms: i32,
}
