use actix_web::{App, http::header::ContentType, HttpResponse, HttpServer, Responder, web};
use chrono::{DateTime, Utc};
use rand::{Rng, thread_rng};
use rand::distributions::Alphanumeric;
use serde::Serialize;
use tokio::time::{Duration, sleep};

#[derive(Serialize)]
pub struct Opera {
    id: String,
    name: String,
    composer: String,
    composed_at: DateTime<Utc>,
    published_at: Option<DateTime<Utc>>,
    description: Option<String>,
    number_of_acts: u64,
    style: Option<String>,
    open_air: bool,
}

#[derive(Serialize)]
pub struct Planet {
    id: String,
    name: String,
    diameter: u64,
    orbit: u64,
    gas: bool,
    discovered_at: DateTime<Utc>,
    discovered_by: String,
    history: Option<String>,
    missions: Option<Vec<String>>,
    moons: Vec<Moon>,
}

#[derive(Serialize)]
pub struct Moon {
    name: String,
    diameter: u64,
    distance: u64,
    discovered_at: Option<DateTime<Utc>>,
    discovered_by: Option<String>,
    possible_life: bool,
}

#[derive(Serialize)]
pub struct Journal {
    id: String,
    name: String,
    title: String,
    issue: u64,
    publisher: Option<String>,
    published_at: Option<DateTime<Utc>>,
    editors: Option<Vec<String>>,
    url: Option<String>,
    articles: Vec<Article>,
}

#[derive(Serialize)]
pub struct Article {
    title: String,
    description: String,
    authors: Vec<String>,
    keywords: Option<Vec<String>>,
    from_page: Option<u64>,
    to_page: Option<u64>,
    last_updated_at: Option<DateTime<Utc>>,
    sections: Option<Vec<Section>>,
}

#[derive(Serialize)]
pub struct Section {
    title: String,
    summary: String,
    words: u64,
    last_updated_at: Option<DateTime<Utc>>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = HttpServer::new(move || {
        App::new()
            .route("/health", web::get().to(health_endpoint))
            .service(web::scope("/health")
                .route("/started", web::get().to(health_endpoint))
                .route("/ready", web::get().to(health_endpoint))
                .route("/live", web::get().to(health_endpoint)))
            .route("/.well-known/jwks.json", web::get().to(jwks_endpoint))
            .service(web::scope("/api/fetch/{id}")
                .route("/small", web::get().to(small_endpoint))
                .route("/medium", web::get().to(medium_endpoint))
                .route("/large", web::get().to(large_endpoint)))
            .service(web::scope("/api/push/{id}")
                .route("/small", web::post().to(small_endpoint))
                .route("/medium", web::post().to(medium_endpoint))
                .route("/large", web::post().to(large_endpoint)))
    });

    println!("Available endpoints:
        /api/fetch/:id/small
        /api/fetch/:id/medium
        /api/fetch/:id/large
        /api/push/:id/small
        /api/push/:id/medium
        /api/push/:id/large");
    println!("Listening for requests on port 8500 ...");

    server.bind("0.0.0.0:8500")?.run().await
}

async fn health_endpoint() -> impl Responder {
    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .body(r#"{"status":"UP"}"#)
}

async fn jwks_endpoint() -> impl Responder {
    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .body(r#"{
              "keys": [
                {
                  "kty": "RSA",
                  "n": "livFI8qB4D0y2jy0CfEqFyy46R0o7S8TKpsx5xbHKoU1VWg6QkQm-ntyIv1p4kE1sPEQO73-HY8-Bzs75XwRTYL1BmR1w8J5hmjVWjc6R2BTBGAYRPFRhor3kpM6ni2SPmNNhurEAHw7TaqszP5eUF_F9-KEBWkwVta-PZ37bwqSE4sCb1soZFrVz_UT_LF4tYpuVYt3YbqToZ3pZOZ9AX2o1GCG3xwOjkc4x0W7ezbQZdC9iftPxVHR8irOijJRRjcPDtA6vPKpzLl6CyYnsIYPd99ltwxTHjr3npfv_3Lw50bAkbT4HeLFxTx4flEoZLKO_g0bAoV2uqBhkA9xnQ",
                  "e": "AQAB",
                  "alg": "RS256",
                  "kid": "sample-id",
                  "use": "sig"
                }
              ]
            }"#)
}

async fn small_endpoint(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();

    HttpResponse::Ok().json(Opera {
        id,
        name: random_string(3, 20),
        composer: random_string(3, 15),
        composed_at: random_datetime(),
        published_at: random_option(|| random_datetime()),
        description: random_option(|| random_string(10, 200)),
        number_of_acts: random_number(1, 6),
        style: random_option(|| random_string(3, 12)),
        open_air: random_bool(),
    })
}

async fn medium_endpoint(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();

    sleep(Duration::from_millis(random_number(0, 5))).await;

    HttpResponse::Ok().json(Planet {
        id,
        name: random_string(4, 12),
        diameter: random_number(1_000, 10_000),
        orbit: random_number(100_000, 7_000_000),
        gas: random_bool(),
        discovered_at: random_datetime(),
        discovered_by: random_string(6, 30),
        history: random_option(|| random_string(50, 200)),
        missions: random_option(|| random_vector(0, 5, || random_string(5, 8))),
        moons: random_vector(0, 3, || Moon {
            name: random_string(2, 12),
            diameter: random_number(100, 5_000),
            distance: random_number(1_000, 20_000),
            discovered_at: random_option(|| random_datetime()),
            discovered_by: random_option(|| random_string(6, 30)),
            possible_life: random_bool(),
        }),
    })
}

async fn large_endpoint(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();

    sleep(Duration::from_millis(random_number(0, 30))).await;

    HttpResponse::Ok().json(Journal {
        id,
        name: random_string(10, 40),
        title: random_string(10, 200),
        issue: random_number(1, 2_000),
        publisher: random_option(|| random_string(5, 15)),
        published_at: random_option(|| random_datetime()),
        editors: random_option(|| random_vector(1, 3, || random_string(5, 15))),
        url: random_option(|| random_string(20, 50)),
        articles: random_vector(1, 12, || Article {
            title: random_string(5, 30),
            description: random_string(100, 250),
            authors: random_vector(1, 3, || random_string(5, 15)),
            keywords: random_option(|| random_vector(1, 5, || random_string(3, 10))),
            from_page: random_option(|| random_number(1, 100)),
            to_page: random_option(|| random_number(1, 100)),
            last_updated_at: random_option(|| random_datetime()),
            sections: random_option(|| random_vector(0, 7, || Section {
                title: random_string(3, 20),
                summary: random_string(30, 200),
                words: random_number(500, 2_500),
                last_updated_at: random_option(|| random_datetime()),
            })),
        }),
    })
}

fn random_bool() -> bool {
    let mut rng = thread_rng();
    return rng.gen_bool(0.5);
}

fn random_number(from: u64, to: u64) -> u64 {
    let mut rng = thread_rng();
    return rng.gen_range(from..to);
}

fn random_string(from: u32, to: u32) -> String {
    let mut rng = thread_rng();
    let length = rng.gen_range(from..to);
    return rng
        .sample_iter(&Alphanumeric)
        .take(usize::try_from(length).unwrap())
        .map(char::from)
        .collect();
}

fn random_datetime() -> DateTime<Utc> {
    let mut rng = thread_rng();
    let millis = rng.gen_range(1682543118000..1714165518000);
    return DateTime::from_timestamp_millis(millis).unwrap();
}

fn random_option<T>(f: fn() -> T) -> Option<T> {
    let mut rng = thread_rng();

    if rng.gen_bool(0.2) {
        return None;
    }
    return Some(f());
}

fn random_vector<T>(from: u64, to: u64, f: fn() -> T) -> Vec<T> {
    let mut v = Vec::new();
    for _ in 0..random_number(from, to) {
        v.push(f());
    }
    return v;
}