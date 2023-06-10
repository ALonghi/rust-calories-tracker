extern crate core;

use clap::Parser;
use std::net::SocketAddr;
use std::str::FromStr;

use dotenv::dotenv;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

use crate::config::Config;
use crate::server::create_app;

mod auth;
mod config;
mod db;
mod dto;
mod error;
mod food;
mod meal;
mod routes;
mod server;
mod user;
mod util;

use crate::auth::AuthConfig;
use crate::config::env::EnvVars;

#[tokio::main]
async fn main() -> () {
    dotenv().ok();
    // Setup tracing
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::DEBUG)
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    let env_vars = EnvVars::init().expect("Missing environment variables");
    let auth_config = AuthConfig::init(&env_vars).expect("Wrong auth configuration");
    // Parse command line arguments
    let config = Config::parse();

    // Run our service
    let addr = SocketAddr::from_str(format!("[::]:{}", config.port).as_str()).unwrap();
    info!("listening on {}", addr);

    let app = create_app(&env_vars, &auth_config)
        .await
        .expect("Error in initializing app");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .expect("Error in creating server");
}
