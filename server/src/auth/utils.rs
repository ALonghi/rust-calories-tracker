use axum::http::{header, Response as AxumResponse};
use axum_extra::extract::cookie::Cookie;
use jsonwebtoken::{encode, EncodingKey, Header};
use uuid::Uuid;

use crate::auth::model::TokenClaims;
use crate::dto::Response;
use crate::error::AppError::AuthError;
use crate::error::Result;

fn create_jwt_token(jwt_secret: &String, user_id: &Uuid) -> Result<String> {
    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::minutes(60)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id.to_string(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    );
    token
        .and_then(|t| Ok(t))
        .map_err(|e| AuthError(format!("Error in creating auth token: {}", e)))
}

pub fn get_response_with_token(
    jwt_secret: &String,
    user_id: &Uuid,
) -> AxumResponse<Response<String>> {
    let token = create_jwt_token(jwt_secret, user_id).expect("Error in creating jwt token");
    let cookies = Cookie::build("token", token.clone())
        .path("/")
        .max_age(time::Duration::hours(1))
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .http_only(true)
        .finish();
    let mut response = AxumResponse::new(Response::from_data(token.to_owned()));
    response.headers_mut().insert(
        header::SET_COOKIE,
        cookies
            .to_string()
            .parse()
            .expect("Error in creating auth cookies"),
    );
    response
}
