use actix_web::web;

use crate::sample::first::first;
use crate::sample::second::second;
use crate::sample::third::third;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/{id}/first", web::get().to(first))
        .route("/{id}/second", web::get().to(second))
        .route("/{id}/third", web::post().to(third));
}
