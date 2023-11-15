use actix_web::{HttpRequest, HttpResponse, Responder, web};
use chrono::{TimeZone, Utc};
use serde::Deserialize;

use crate::sample::api::{DetailItem, ErrorResponse, OverviewItem, OverviewItemList, Preview, Step};
use crate::sample::steps::get_steps;
use crate::sample::storage::{get_stored_item, get_stored_items, get_stored_previews};
use crate::shared::auth::auth;
use crate::shared::database::Database;

#[derive(Deserialize)]
pub struct OverviewQuery {
    from: Option<String>,
    limit: Option<i32>,
}

pub async fn get_overview(
    query: web::Query<OverviewQuery>,
    db_data: web::Data<Database>,
    req: HttpRequest,
) -> impl Responder {
    let current_user = auth(req);
    if current_user.is_none() {
        return HttpResponse::Forbidden().json(ErrorResponse { message: String::from("Bad authorization") });
    }

    let stored_items = get_stored_items(
        db_data.as_ref(),
        current_user.unwrap().id(),
        query.from.clone(),
        query.limit.unwrap_or(10) + 1,
    ).await;
    if let Err(e) = stored_items {
        return HttpResponse::InternalServerError().json(ErrorResponse { message: e.to_string() });
    }

    let mut items: Vec<_> = stored_items.unwrap()
        .into_iter()
        .map(|stored_item| OverviewItem {
            id: stored_item.id,
            title: stored_item.title,
            description: stored_item.description,
            status: stored_item.status,
            color: stored_item.color,
            iteration: stored_item.iteration as i32,
            updated_at: Utc.from_utc_datetime(&stored_item.updated_at),
        })
        .collect();
    let last = items.pop();

    HttpResponse::Ok().json(OverviewItemList {
        items,
        next: last.map(|i| i.id),
    })
}

pub async fn get_detail(
    path: web::Path<String>,
    db_data: web::Data<Database>,
    req: HttpRequest,
) -> impl Responder {
    let optional_current_user = auth(req);
    if optional_current_user.is_none() {
        return HttpResponse::Forbidden().json(ErrorResponse { message: String::from("Bad authorization") });
    }
    let current_user = optional_current_user.unwrap();

    let item_id = path.into_inner();

    let stored_item_result = get_stored_item(
        db_data.as_ref(),
        current_user.id(),
        item_id.clone(),
    ).await;
    if let Err(e) = stored_item_result {
        return HttpResponse::InternalServerError().json(ErrorResponse { message: e.to_string() });
    }
    let stored_item = stored_item_result.unwrap();
    if stored_item.is_none() {
        return HttpResponse::NotFound().json(ErrorResponse { message: item_id });
    }
    let item = stored_item.unwrap();

    let stored_previews = get_stored_previews(
        db_data.as_ref(),
        item_id.clone(),
    ).await;
    if let Err(e) = stored_previews {
        return HttpResponse::InternalServerError().json(ErrorResponse { message: e.to_string() });
    }
    let previews = stored_previews.unwrap();

    let status_steps_result = get_steps(
        current_user.raw_token(),
        item_id,
    ).await;
    if let Err(e) = status_steps_result {
        return HttpResponse::BadGateway().json(ErrorResponse { message: e.to_string() });
    }
    let (status, external_steps) = status_steps_result.unwrap();
    if status != 200 {
        return HttpResponse::BadGateway().json(ErrorResponse { message: status.to_string() });
    }

    HttpResponse::Ok().json(DetailItem {
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        color: item.color,
        iteration: item.iteration as i32,
        previews: previews
            .into_iter()
            .map(|p| Preview {
                id: p.id,
                data: p.data,
                created_at: Utc.from_utc_datetime(&p.created_at),
            })
            .collect(),
        steps: external_steps
            .into_iter()
            .map(|s| Step {
                name: s.name,
                labels: s.labels,
                duration_in_ms: s.duration_in_ms,
            })
            .collect(),
        updated_at: chrono::offset::Utc::now(),
    })
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/items", web::get().to(get_overview))
        .route("/items/{itemId}", web::get().to(get_detail));
}
