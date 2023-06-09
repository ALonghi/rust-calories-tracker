use std::sync::Arc;

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::State,
    http::{header, Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::cookie::CookieJar;
use jsonwebtoken::{decode, DecodingKey, Validation};
use tower_http::follow_redirect::policy::PolicyExt;

use crate::auth::model::LoginUserSchema;
use crate::auth::model::TokenClaims;
use crate::auth::service::search_by_email;
use crate::auth::utils::get_response_with_token;
use crate::config::AppState;
use crate::dto::Response;
use crate::error::{AppError, UserRepoError};
use crate::user::service::get_user_by_id;

pub async fn auth<B>(
    cookie_jar: CookieJar,
    State(state): State<Arc<AppState>>,
    mut req: Request<B>,
    next: Next<B>,
) -> Result<impl IntoResponse, (StatusCode, Json<Response<String>>)> {
    let token = cookie_jar
        .get("token")
        .map(|cookie| cookie.value().to_string())
        .or_else(|| {
            req.headers()
                .get(header::AUTHORIZATION)
                .and_then(|auth_header| auth_header.to_str().ok())
                .and_then(|auth_value| {
                    if auth_value.starts_with("Bearer ") {
                        Some(auth_value[7..].to_owned())
                    } else {
                        None
                    }
                })
        });
    //
    // let token = token.ok_or_else(|| {
    //     let json_error = Response::<String>::from_err(&String::from(
    //         "You are not logged in, please provide token",
    //     ));
    //     (StatusCode::UNAUTHORIZED, Json(json_error))
    // })?;
    //
    // let claims = decode::<TokenClaims>(
    //     &token,
    //     &DecodingKey::from_secret(state.jwt_secret.as_ref()),
    //     &Validation::default(),
    // )
    // .map_err(|_| {
    //     let json_error = Response::from_err(&String::from("Invalid token"));
    //     (StatusCode::UNAUTHORIZED, Json(json_error))
    // })?
    // .claims;
    //
    // let user_id = uuid::Uuid::parse_str(&claims.sub).map_err(|_| {
    //     let json_error = Response::from_err(&String::from("Invalid token"));
    //     (StatusCode::UNAUTHORIZED, Json(json_error))
    // })?;
    //
    // let user = get_user_by_id(&user_id.to_string(), state.get_users_collection()) // todo:
    //     .await
    //     .map_err(|e| {
    //         let json_error = Response::from_err(&String::from("Error fetching user from database"));
    //         (StatusCode::INTERNAL_SERVER_ERROR, Json(json_error))
    //     })?;
    //
    // let user = user.ok_or_else(|| {
    //     let json_error = Response::from_err(&String::from(
    //         "The user belonging to this token no longer exists",
    //     ));
    //     (StatusCode::UNAUTHORIZED, Json(json_error))
    // })?;
    //
    // req.extensions_mut().insert(user);
    Ok(next.run(req).await)
}

pub async fn login_user_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<LoginUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<Response<String>>)> {
    let user = search_by_email(&body.email, state.get_users_collection())
        .await
        .and_then(|user_opt| match user_opt {
            Some(u) => Ok(u),
            None => Err(AppError::UserRepo(UserRepoError::InvalidUser(
                body.email.clone(),
            ))),
        })?;
    let is_valid = match PasswordHash::new(&user.password) {
        Ok(parsed_hash) => Argon2::default()
            .verify_password(body.password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true),
        Err(_) => false,
    };
    if !is_valid {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(Response::from_err(&"Invalid email or password".to_string())),
        ));
    }
    Ok(Json(Response::<String>::from_err(&String::from("madeup"))))
    // Ok(get_response_with_token(&state.jwt_secret, &user.id))
}
