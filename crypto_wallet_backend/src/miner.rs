use {
    crate::wallet::*,
    diesel::{result::Error, Insertable, Queryable},
    serde::{Deserialize, Serialize},
    uuid::Uuid,
};

//-------------------- Json Payload

#[derive(Serialize, Deserialize, Debug)]
pub struct Miner {
    pub id: String,
    pub address: String,
    pub club_name: String,
    pub nickname: String,
    pub hash_rate: i32, // miga hash / sec
    pub shares_mined: i32,
}

impl Miner {
    pub fn to_miner_dao(&self) -> MinerDAO {
        MinerDAO {
            id: Uuid::parse_str(self.id.as_str()).unwrap(),
            address: Uuid::parse_str(self.address.as_str()).unwrap(),
            nickname: self.nickname.clone(),
            hash_rate: self.hash_rate,
            shares_mined: self.shares_mined
        }
    }
}

//-------------------- Post Request Body for new Miner
#[derive(Serialize, Deserialize, Debug)]
pub struct NewMinerRequest {
    nickname: String,
}

//-------------------- DAO Object (DB Table Record)
// #[derive(Queryable, Insertable)]
// #[table_name = "miners"]
pub struct MinerDAO {
    pub id: Uuid,
    pub address: Uuid,
    pub nickname: String,
    pub hash_rate: i32, // miga hash / sec
    pub shares_mined: i32,
}

impl MinerDAO {
    pub fn to_miner(&self, club_name: String) -> Miner {
        Miner { 
            id: self.id.to_string(),
            address: self.address.to_string(),
            club_name: club_name,
            nickname: self.nickname.clone(),
            hash_rate: self.hash_rate,
            shares_mined: self.shares_mined }
    }
}
