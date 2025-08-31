use axum::http::header;
use axum::Json;
use axum::response::{IntoResponse, Response};
use axum_extra::extract::cookie::Cookie;
use jsonwebtoken::{encode, EncodingKey, Header};
use tracing_subscriber::filter::FilterExt;
use uuid::Uuid;

use crate::auth::AuthConfig;
use crate::auth::model::TokenClaims;
use crate::dto::{AuthData, LoginResponse};
use crate::error::AppError::AuthError;
use crate::error::Result;
use crate::user::model::{FilteredUser, User};

pub fn create_jwt_token(token_age_seconds: &i64, secret: &String, user_id: &Uuid) -> Result<String> {
    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::seconds(token_age_seconds.to_owned())).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id.to_string(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    );
    token
        .and_then(|t| Ok(t))
        .map_err(|e| AuthError(format!("Error in creating auth token: {}", e)))
}

pub fn decode_jwt_token()

fn create_token_cookie<'c>(token: String, duration_in_seconds: i64, cookie_name: &str) -> Cookie<'c> {
    Cookie::build("token", token.clone())
        .path("/")
        .max_age(time::Duration::seconds(duration_in_seconds))
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .http_only(true)
        .finish()
}

pub fn get_response_with_token(auth_config: &AuthConfig, user: &User) -> Result<Response> {
    let token = create_jwt_token(&auth_config.token_age_seconds, &auth_config.jwt_secret, &user.id).expect("Error in creating jwt token");
    let refresh_token = create_jwt_token(&auth_config.refresh_token_age_seconds, &auth_config.refresh_jwt_secret, &user.id).expect("Error in creating jwt token");
    let token_cookie = create_token_cookie(token.clone(), auth_config.token_age_seconds, "token");
    let refresh_token_cookie = create_token_cookie(refresh_token.clone(), auth_config.token_age_seconds, "refreshToken");

    let mut response = Json(LoginResponse {
        data: AuthData {
            token,
            expires_in_seconds: auth_config.token_age_seconds,
            refresh_token,
            refresh_expires_in_seconds: auth_config.refresh_token_age_seconds,
            user: FilteredUser::from_user(user.to_owned()),
        },
        success: true,
    })
        .into_response();

    response.headers_mut().insert(
        header::SET_COOKIE,
        token_cookie
            .to_string()
            .parse()
            .expect("Error in creating token cookies"),
    );

    response.headers_mut().insert(
        header::SET_COOKIE,
        refresh_token_cookie
            .to_string()
            .parse()
            .expect("Error in creating refresh token cookies"),
    );
    Ok(response)
}
