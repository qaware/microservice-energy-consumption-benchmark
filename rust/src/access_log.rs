use rocket::{
    fairing::{Fairing, Info, Kind},
    Data, Request, Response,
};

pub struct AccessLog;

#[rocket::async_trait]
impl Fairing for AccessLog {

    fn info(&self) -> Info {
        Info {
            name: "Access Log",
            kind: Kind::Request | Kind::Response,
        }
    }

    async fn on_request(&self, _req: &mut Request<'_>, _data: &mut Data<'_>) {
        todo!()
    }

    async fn on_response<'r>(&self, _req: &'r Request<'_>, _res: &mut Response<'r>) {
        todo!()
    }
}