use std::str::FromStr;

use crate::miner;

use {
    serde::{Serialize, Deserialize},
    crate::miner::*,
    diesel::{Insertable, Queryable, result::Error},
    uuid::Uuid,
};

//-------------------- Json Payload 

#[derive(Serialize, Deserialize, Debug)]
pub struct Wallet {
    pub address: String,
    pub club_name: String,
    pub total_hash_rate: i32, // miga hash / sec
    pub total_shares_mined: i32,
    pub total_worker_online: i32,
    pub workers_online: Vec<Miner>,
}

impl Wallet {
    pub fn to_wallet_dao(&self) -> WalletDAO {
        WalletDAO { 
            address: Uuid::from_str(self.address.as_str()).unwrap(),
            club_name: self.club_name.clone()
        }
    }
}

//-------------------- Post Request Body for new Wallet
#[derive(Serialize, Deserialize, Debug)]
pub struct NewWalletRequest {
    club_name: String
}

//-------------------- DAO Object (DB Table Record)
// #[derive(Queryable, Insertable)]
// #[table_name = "wallets"]
pub struct WalletDAO {
    pub address: Uuid,
    pub club_name: String,
}

impl WalletDAO {
    pub fn to_wallet(&self, miners: Vec<Miner>) -> Wallet {
        Wallet { 
            address: self.address.to_string(),
            club_name: self.club_name.clone(),
            total_hash_rate: miners.iter().map(|m| m.hash_rate).sum(),
            total_shares_mined: miners.iter().map(|m| m.shares_mined).sum(),
            total_worker_online: miners.len() as i32,
            workers_online: miners }
    }
}
