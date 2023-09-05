use rocket::http::ContentType;

static OPENAPI_YAML: &'static [u8] = include_bytes!("../resources/openapi.yaml");

#[rocket::get("/openapi")]
pub fn openapi() -> (ContentType, &'static [u8]) {
    (ContentType::new("application", "x-yaml"), OPENAPI_YAML)
}
