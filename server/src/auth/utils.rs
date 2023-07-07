use axum::http::header;
use axum::response::{IntoResponse, Response};
use axum::Json;
use axum_extra::extract::cookie::Cookie;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::Serialize;

use uuid::Uuid;

use crate::auth::model::TokenClaims;
use crate::auth::AuthConfig;
use crate::error::AppError::AuthError;
use crate::error::Result;
use crate::user::model::{FilteredUser, User};

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

pub fn get_response_with_token(auth_config: &AuthConfig, user: &User) -> Result<Response> {
    let token = create_jwt_token(auth_config, &user.id).expect("Error in creating jwt token");
    let cookies = Cookie::build("token", token.clone())
        .path("/")
        .max_age(time::Duration::seconds(auth_config.token_age_seconds))
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .http_only(true)
        .finish();

    #[derive(Clone, Serialize, Debug)]
    pub struct AuthData {
        token: String,
        user: FilteredUser,
    }
    #[derive(Clone, Serialize, Debug)]
    pub struct MyLoginRes {
        data: AuthData,
        success: bool,
    }
    let mut response =
        // axum::http::Response::new(
        Json(MyLoginRes {
            data: AuthData {
                token,
                user: FilteredUser::from_user(user.to_owned())
            },
            success: true,
        }).into_response();
    // json!({
    //     "data": {
    //         "token": token,
    //         "user": FilteredUser::from_user(user.to_owned())
    //     },
    //     "success": "true"
    // })
    // .to_string(),
    // );
    response.headers_mut().insert(
        header::SET_COOKIE,
        cookies
            .to_string()
            .parse()
            .expect("Error in creating auth cookies"),
    );
    Ok(response)
}
