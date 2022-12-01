use {
    actix_web::HttpResponse,
    actix_web::{get, post},
    actix_web::web::{Json},
    crate::wallet::*,
    crate::utils::*,    
};


// List all wallets

#[get("/wallets")]

pub async fn list_wallets() -> HttpResponse {
    /*
        TODO: get all walletDAO from DB and convert to Wallet Object
    */
    let wallets: Vec<Wallet> = vec![];
    ResponseType::Ok(wallets).get_response()
}

// Get wallet 

#[get("/wallets/{id}")]
pub async fn get_wallet() -> HttpResponse {
    /*
        TODO: get walletDAO from DB WHERE id = request id
         and convert to Wallet Object
    */
    let wallet: Option<Wallet> = None;
    match wallet {
        Some(value) => ResponseType::Ok(value).get_response(),
        None => ResponseType::NotFound(
            NotFoundMessage::new("Wallet/Club not found".to_string())
        ).get_response(),
    }
}

// Create Wallet

#[post("/wallets")]
pub async fn create_wallet(request_body: Json<NewWalletRequest>) -> HttpResponse {
    /*
        TODO: create a new WalletDAO from request inputs and write to DB
    */
    
    let wallet: Vec<Wallet> = vec![];
    ResponseType::Created(wallet).get_response()
}
