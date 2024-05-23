use actix_web::{HttpRequest, HttpResponse, Responder, web};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::sample::backend::{Article, BackendClient, Journal, Opera};
use crate::sample::error::ErrorResponse;
use crate::shared::auth::auth;

#[derive(Deserialize)]
pub struct ThirdRequest {
    value: String,
    count: u64,
    timestamp: DateTime<Utc>,
}

#[derive(Serialize)]
struct Response {
    name: String,
    description: String,
    created_at: Option<DateTime<Utc>>,
    last_updated_at: DateTime<Utc>,
    labels: Vec<String>,
    total_count: u64,
    items: Vec<Item>,
}

#[derive(Serialize)]
struct Item {
    details: String,
    steps: Vec<String>,
    contents: Vec<String>,
    timestamp: Option<DateTime<Utc>>,
}

pub async fn third(
    path: web::Path<String>,
    body: web::Json<ThirdRequest>,
    backend_client: web::Data<BackendClient>,
    req: HttpRequest,
) -> impl Responder {
    let optional_current_user = auth(req);
    if optional_current_user.is_none() {
        return HttpResponse::Forbidden().json(ErrorResponse { message: String::from("Bad authorization") });
    }
    let current_user = optional_current_user.unwrap();
    let user_token = current_user.raw_token();
    let id = path.into_inner();
    let request = body.into_inner();

    let push_small_result1 = backend_client.push_small(
        &user_token,
        &format!("a.10:{}", id),
        Opera {
            id: "".to_string(),
            name: format!("first {}", request.value),
            composer: "".to_string(),
            composed_at: request.timestamp,
            published_at: None,
            description: None,
            number_of_acts: 10,
            style: None,
            open_air: false,
        },
    ).await;
    if let Err(response) = push_small_result1 {
        return response;
    }
    let result1 = push_small_result1.unwrap();

    let push_small_result2 = backend_client.push_small(
        &user_token,
        &format!("a.20:{}", id),
        Opera {
            id: "".to_string(),
            name: format!("second {}", request.value),
            composer: "".to_string(),
            composed_at: request.timestamp,
            published_at: None,
            description: None,
            number_of_acts: 20,
            style: None,
            open_air: false,
        },
    ).await;
    if let Err(response) = push_small_result2 {
        return response;
    }
    let result2 = push_small_result2.unwrap();

    let push_large_result = backend_client.push_large(
        &user_token,
        &format!("{}++xg.3.f4:{}", current_user.id(), id),
        Journal {
            id: "".to_string(),
            name: request.value,
            title: "".to_string(),
            issue: request.count,
            publisher: None,
            published_at: None,
            editors: None,
            url: None,
            articles: vec![
                Article {
                    title: result1.name,
                    description: "".to_string(),
                    authors: vec![],
                    keywords: None,
                    from_page: None,
                    to_page: None,
                    last_updated_at: Some(result1.composed_at),
                    sections: None,
                },
                Article {
                    title: result2.name,
                    description: "".to_string(),
                    authors: vec![],
                    keywords: None,
                    from_page: None,
                    to_page: None,
                    last_updated_at: Some(result2.composed_at),
                    sections: None,
                },
            ],
        },
    ).await;
    if let Err(response) = push_large_result {
        return response;
    }
    let journal = push_large_result.unwrap();

    HttpResponse::Ok().json(Response {
        name: journal.name,
        description: format!(
            "{} {} {}",
            journal.title,
            journal.publisher.unwrap_or("".to_string()),
            journal.url.unwrap_or("".to_string()),
        ),
        created_at: journal.published_at,
        last_updated_at: journal.articles.iter()
            .map(|article| article.last_updated_at)
            .flat_map(|opt| opt)
            .max()
            .unwrap_or_else(Utc::now),
        labels: journal.editors.iter().flat_map(|v| v.iter()).map(|s| format!("- {}", s)).collect(),
        total_count: journal.articles.iter().map(|article| article.sections.iter().flat_map(|v| v.iter()).count() as u64).sum(),
        items: journal.articles.iter().map(|article| Item {
            details: article.description.clone(),
            steps: article.authors.clone(),
            contents: article.sections.iter()
                .flat_map(|v| v.iter())
                .map(|section| section.summary.clone())
                .collect(),
            timestamp: article.last_updated_at,
        }).collect(),
    })
}
