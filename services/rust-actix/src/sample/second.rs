use actix_web::{HttpRequest, HttpResponse, Responder, web};
use chrono::{DateTime, Utc};
use itertools::Itertools;
use serde::Serialize;

use crate::sample::backend::{BackendClient, Moon};
use crate::sample::error::ErrorResponse;
use crate::shared::auth::auth;

#[derive(Serialize)]
struct Response {
    relevant: bool,
    omit: bool,
    description: String,
    weight: u64,
    items: Vec<Item>,
}

#[derive(Serialize)]
struct Item {
    name: String,
    details: Option<String>,
    timestamp: DateTime<Utc>,
    count: u64,
}

pub async fn second(
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

    let fetch_medium_result = backend_client.fetch_medium(
        &user_token,
        &format!("{}++sec-{}", current_user.id(), id),
    ).await;
    if let Err(response) = fetch_medium_result {
        return response;
    }
    let planet = fetch_medium_result.unwrap();
    let name1 = get_name(&planet.moons, 0);
    let name2 = get_name(&planet.moons, 1);
    let name3 = get_name(&planet.moons, 2);

    let fetch_small_result1 = backend_client.fetch_small(
        &user_token,
        &format!("foo_{}", name1),
    ).await;
    if let Err(response) = fetch_small_result1 {
        return response;
    }
    let opera1 = fetch_small_result1.unwrap();

    let fetch_small_result2 = backend_client.fetch_small(
        &user_token,
        &format!("bar_{}", name2),
    ).await;
    if let Err(response) = fetch_small_result2 {
        return response;
    }
    let opera2 = fetch_small_result2.unwrap();

    let fetch_small_result3 = backend_client.fetch_small(
        &user_token,
        &format!("quz_{}", name3),
    ).await;
    if let Err(response) = fetch_small_result3 {
        return response;
    }
    let opera3 = fetch_small_result3.unwrap();

    HttpResponse::Ok().json(Response {
        relevant: planet.missions.unwrap_or(vec![]).iter().any(|m| m.contains("f")),
        omit: !planet.gas,
        description: planet.moons.iter().map(|moon| &moon.name).join("--"),
        weight: planet.diameter + planet.orbit,
        items: vec![
            Item{
                name: name1.to_string(),
                details: opera1.style,
                timestamp: opera1.composed_at,
                count: opera1.number_of_acts,
            },
            Item{
                name: name2.to_string(),
                details: opera2.style,
                timestamp: opera2.composed_at,
                count: opera2.number_of_acts,
            },
            Item{
                name: name3.to_string(),
                details: opera3.style,
                timestamp: opera3.composed_at,
                count: opera3.number_of_acts,
            },
        ],
    })
}

fn get_name(moons: &Vec<Moon>, index: usize) -> &str {
    if index >= moons.len() {
        return "(none)";
    }
    return &moons[index].name;
}