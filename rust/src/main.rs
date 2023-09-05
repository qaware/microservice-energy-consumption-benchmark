use database::Database;

mod delay;
mod health;
mod data;
mod database;
mod resources;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    ecs_logger::init();

    // TODO: improve error handling
    let db = Database::new().await.unwrap();

    let _ = rocket::build()
        .manage(db)
        .mount("/", rocket::routes![
            resources::openapi])
        .mount("/health", rocket::routes![
            health::started,
            health::live,
            health::ready])
        .mount("/api/delay", rocket::routes![
            delay::delay])
        .mount("/api/data", rocket::routes![
            data::get_data_for_id,
            data::put_data_for_id])
        .launch()
        .await?;

    Ok(())
}

