use actix_web::{HttpRequest, HttpResponse, Responder, web};
use base64::prelude::*;
use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::sample::backend::{Article, BackendClient};
use crate::sample::error::ErrorResponse;
use crate::shared::auth::auth;

#[derive(Serialize)]
struct Response {
    id: String,
    hash: String,
    version: String,
    url: Option<String>,
    total_number_of_items: u64,
    selected_items: Vec<Item>,
}

#[derive(Serialize)]
struct Item {
    name: String,
    tags: Vec<String>,
    length: Option<u64>,
    created_at: Option<DateTime<Utc>>,
}

pub async fn first(
    path: web::Path<String>,
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

    let fetch_large_result = backend_client.fetch_large(
        &user_token,
        &format!("{}++{}", current_user.id(), id),
    ).await;
    if let Err(response) = fetch_large_result {
        return response;
    }
    let journal = fetch_large_result.unwrap();

    let mut articles = journal.articles.iter().collect::<Vec<&Article>>();
    articles.sort_by(|a,b| a.title.cmp(&b.title));

    let first_items = articles[0..usize::min(5, articles.len())].iter().map(|article| Item{
        name: article.title.clone(),
        tags: sorted(article.authors.clone()),
        length: get_difference(article.from_page, article.to_page),
        created_at: article.last_updated_at,
    }).collect();

    let mut  hash = md5::Context::new();
    hash.consume(journal.title);
    for editor in journal.editors.unwrap_or_else(||vec![]).iter() {
        hash.consume(editor)
    }

    HttpResponse::Ok().json(Response {
        id: journal.id,
        hash: BASE64_STANDARD.encode(hash.compute().to_vec()),
        version: journal.issue.to_string(),
        url: journal.url,
        total_number_of_items: journal.articles.iter()
            .flat_map(|article| article.sections.iter().flat_map(|v|v.iter()))
            .map(|section| section.words)
            .sum(),
        selected_items: first_items,
    })
}

fn sorted(mut strings: Vec<String>) -> Vec<String> {
    strings.sort();
    return strings;
}

fn get_difference(a: Option<u64>, b : Option<u64>) -> Option<u64> {
    if a.is_none() && b.is_none() {
        return None;
    }
    return Some(a.unwrap_or(0).abs_diff(b.unwrap_or(0)));
}
