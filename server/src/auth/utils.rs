use crate::auth::AuthConfig;
use axum::http::header;

use axum_extra::extract::cookie::Cookie;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use uuid::Uuid;

use crate::auth::model::TokenClaims;

use crate::error::AppError::AuthError;
use crate::error::Result;

pub fn create_jwt_token(auth_config: &AuthConfig, user_id: &Uuid) -> Result<String> {
    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::seconds(auth_config.token_age_seconds)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id.to_string(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(auth_config.jwt_secret.as_ref()),
    );
    token
        .and_then(|t| Ok(t))
        .map_err(|e| AuthError(format!("Error in creating auth token: {}", e)))
}

pub fn get_response_with_token(
    auth_config: &AuthConfig,
    user_id: &Uuid,
) -> Result<axum::http::Response<String>> {
    let token = create_jwt_token(auth_config, &user_id).expect("Error in creating jwt token");
    let cookies = Cookie::build("token", token.clone())
        .path("/")
        .max_age(time::Duration::seconds(auth_config.token_age_seconds))
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .http_only(true)
        .finish();

    let mut response = axum::http::Response::new(
        json!({
            "data": token.clone(),
            "success": "true"
        })
        .to_string(),
    );
    response.headers_mut().insert(
        header::SET_COOKIE,
        cookies
            .to_string()
            .parse()
            .expect("Error in creating auth cookies"),
    );
    Ok(response)
}
