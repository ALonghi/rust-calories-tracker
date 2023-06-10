use std::sync::Arc;

use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::State,
    http::{header, Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::cookie::CookieJar;
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::auth::model::{LoginUserSchema, RegisterUserSchema, TokenClaims};
use crate::auth::service::search_by_email;
use crate::auth::utils::get_response_with_token;
use crate::config::AppState;
use crate::dto::Response;

use crate::user::model::{FilteredUser, User};
use crate::user::service::{create_user, get_user_by_id};

pub async fn auth<B>(
    cookie_jar: CookieJar,
    State(state): State<Arc<AppState>>,
    mut req: Request<B>,
    next: Next<B>,
) -> Result<impl IntoResponse, (StatusCode, Json<Response<String>>)> {
    let destination_uri = req.uri().clone().to_string();
    if destination_uri.contains("/signup") || destination_uri.contains("/login") {
        return Ok(next.run(req).await);
    };
    let token_opt = cookie_jar
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

    let token = token_opt.ok_or_else(|| {
        let json_error = Response::<String>::from_err(&String::from(
            "You are not logged in, please provide token",
        ));
        (StatusCode::UNAUTHORIZED, Json(json_error))
    })?;

    let claims = decode::<TokenClaims>(
        &token,
        &DecodingKey::from_secret(state.auth_config.jwt_secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| {
        let json_error = Response::from_err(&String::from("Invalid token"));
        (StatusCode::UNAUTHORIZED, Json(json_error))
    })?
    .claims;

    let user_id = uuid::Uuid::parse_str(&claims.sub).map_err(|_| {
        let json_error = Response::from_err(&String::from("Invalid token"));
        (StatusCode::UNAUTHORIZED, Json(json_error))
    })?;

    let user = get_user_by_id(&user_id.to_string(), state.get_users_collection()) // todo:
        .await
        .map_err(|_e| {
            let json_error = Response::from_err(&String::from("Error fetching user from database"));
            (StatusCode::INTERNAL_SERVER_ERROR, Json(json_error))
        })?;

    let user = user.ok_or_else(|| {
        let json_error = Response::from_err(&String::from(
            "The user belonging to this token no longer exists",
        ));
        (StatusCode::UNAUTHORIZED, Json(json_error))
    })?;

    req.extensions_mut().insert(user);
    Ok(next.run(req).await)
}

pub async fn login_user_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<LoginUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<Response<String>>)> {
    let user = search_by_email(&body.email, state.get_users_collection())
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response::<String>::from_err(&e.to_string())),
            )
        })?
        .ok_or_else(|| {
            (
                StatusCode::NOT_FOUND,
                Json(Response::<String>::from_err(
                    &"Invalid email or password".to_string(),
                )),
            )
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
            Json(Response::<String>::from_err(
                &"Invalid email or password".to_string(),
            )),
        ));
    }
    Ok(get_response_with_token(&state.auth_config, &user.id)?)
}

pub async fn register_user_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<RegisterUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<Response<String>>)> {
    let user_exists: bool = search_by_email(&body.email, state.get_users_collection())
        .await
        .map(|user_opt| user_opt.is_some())?;

    if user_exists {
        let error_response = Response {
            success: false,
            data: None,
            error_message: Some(String::from("User with that email already exists")),
        };
        return Err((StatusCode::CONFLICT, Json(error_response)));
    }

    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default()
        .hash_password(body.password.as_bytes(), &salt)
        .map_err(|e| {
            let error_response = Response {
                success: false,
                data: None,
                error_message: Some(format!("Error while hashing password: {}", e)),
            };
            (StatusCode::INTERNAL_SERVER_ERROR, Json(error_response))
        })
        .map(|hash| hash.to_string())?;

    let user = User::create(&body.name, &body.email, &hashed_password);

    create_user(&user, state.get_users_collection()).await?;

    let user_response = Response {
        success: true,
        data: Some(FilteredUser::from_user(user)),
        error_message: None,
    };

    Ok((StatusCode::OK, Json(user_response)))
}
