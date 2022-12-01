use {
    actix_web::HttpResponse,
    actix_web::{get, post},
    actix_web::web::{Json},
    crate::miner::*,
    crate::utils::*,
};


// List all miners

#[get("/miners")]
pub async fn list_miners() -> HttpResponse {
    /*
        TODO: get all MinerDAO from DB and convert to miners
    */
    let miners: Vec<Miner> = vec![];
    ResponseType::Ok(miners).get_response()
}

// get miner by id

#[get("/miners/{id}")]
pub async fn get_miner() -> HttpResponse {
    /*
        TODO: get MinerDAO from DB WHERE id = requested id 
            and convert to Miner Object
    */
    
    let miner: Option<Miner> = None;
    match miner {
        Some(value) => ResponseType::Ok(value).get_response(),
        None => ResponseType::NotFound(
            NotFoundMessage::new("Miner not found".to_string())
        ).get_response(),
    }
}

// create new Miner

#[post("/wallet/{address}/miners")]
pub async fn create_miner(request_body: Json<NewMinerRequest>) -> HttpResponse {
    /*
        TODO: create new MinerDAO from request and write to DB
    */
    let miner: Vec<Miner> = vec![];
    ResponseType::Created(miner).get_response()
}