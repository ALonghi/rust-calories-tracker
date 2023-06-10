use std::sync::Arc;

use axum::http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use axum::http::Method;
use axum::{http::HeaderValue, Router};

use crate::auth::AuthConfig;
use tower_http::cors::CorsLayer;

use crate::config::env::EnvVars;
use crate::config::AppState;
use crate::db::DB;
use crate::error::Result;
use crate::routes::get_routes;

pub async fn create_app(env_vars: &EnvVars, auth_config: &AuthConfig) -> Result<Router> {
    // Build our database for holding the key/value pairs
    let state = Arc::new(AppState {
        db_client: DB::init(env_vars).await?.client,
        app_name: env_vars.app_name.clone(),
        auth_config: auth_config.clone(),
    });

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:8000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    // Build route service
    Ok(get_routes(state).layer(cors))
}
