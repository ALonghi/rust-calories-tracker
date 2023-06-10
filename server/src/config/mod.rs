use bson::Document;
use clap::Parser;
use mongodb::{Client, Collection, Database};

use crate::auth::AuthConfig;

pub mod env;

/// Simple key/value store with an HTTP API
#[derive(Debug, Parser)]
pub struct Config {
    /// The port to listen on
    #[clap(short = 'p', long, default_value = "8080")]
    pub port: u16,
}

#[derive(Clone, Debug)]
pub struct AppState {
    pub db_client: Client,
    pub app_name: String,
    pub auth_config: AuthConfig,
}

impl AppState {
    pub fn get_database(&self) -> Database {
        self.db_client.database(&self.app_name)
    }

    pub fn get_meals_collection(&self) -> Collection<Document> {
        self.get_database().collection("meals")
    }

    pub fn get_foods_collection(&self) -> Collection<Document> {
        self.get_database().collection("foods")
    }

    pub fn get_users_collection(&self) -> Collection<Document> {
        self.get_database().collection("users")
    }
}
