use axum::http::StatusCode;
use axum::Json;
use thiserror::Error;

use crate::dto::Response;

pub type Result<T> = core::result::Result<T, AppError>;

/// Our pages's top level error type.
#[derive(Error, Debug)]
pub enum AppError {
    #[error("action in meals repo failed")]
    MealRepo(MealRepoError),
    #[error("action in foods repo failed")]
    FoodRepo(FoodRepoError),
    #[error("action in user repo failed")]
    UserRepo(UserRepoError),
    #[error("mongodb error: {0}")]
    MongoError(#[from] mongodb::error::Error),
    #[error("could not access field in document: {0}")]
    MongoDataError(#[from] bson::document::ValueAccessError),
    #[error("internal server error")]
    InternalServerError,
    #[error("auth error")]
    AuthError(String),
}

/// Errors that can happen when using the task repo.
#[derive(Error, Debug)]
pub enum MealRepoError {
    #[allow(dead_code)]
    #[error("meal not found")]
    NotFound,
    #[allow(dead_code)]
    #[error("meal is invalid: {0}")]
    InvalidMeal(String),
    #[allow(dead_code)]
    #[error("decoding meal resulted in an error: {0}")]
    DecodeError(String),
    #[allow(dead_code)]
    #[error("transaction for meal resulted in an error: {0}")]
    TransactionError(String),
}

/// Errors that can happen when using the task repo.
#[derive(Error, Debug)]
pub enum FoodRepoError {
    #[allow(dead_code)]
    #[error("food not found")]
    NotFound,
    #[allow(dead_code)]
    #[error("Food is invalid: {0}")]
    InvalidFood(String),
    #[allow(dead_code)]
    #[error("decoding food resulted in an error: {0}")]
    DecodeError(String),
}

/// Errors that can happen when using the task repo.
#[derive(Error, Debug)]
pub enum UserRepoError {
    #[allow(dead_code)]
    #[error("user not found")]
    NotFound,
    #[allow(dead_code)]
    #[error("user is invalid: {0}")]
    InvalidUser(String),
    #[allow(dead_code)]
    #[error("decoding user resulted in an error: {0}")]
    DecodeError(String),
}

/// This makes it possible to use `?` to automatically convert a `MealRepoError`
/// into an `AppError`.
impl From<MealRepoError> for AppError {
    fn from(inner: MealRepoError) -> Self {
        AppError::MealRepo(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `FoodRepoError`
/// into an `AppError`.
impl From<FoodRepoError> for AppError {
    fn from(inner: FoodRepoError) -> Self {
        AppError::FoodRepo(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `UserRepoError`
/// into an `AppError`.
impl From<UserRepoError> for AppError {
    fn from(inner: UserRepoError) -> Self {
        AppError::UserRepo(inner)
    }
}

/// This makes it possible to use `?` to automatically convert a `TaskRepoError`
/// into an `AppError`.
impl From<AppError> for std::result::Result<(), AppError> {
    fn from(inner: AppError) -> Self {
        std::result::Result::Err(inner)
    }
}

impl<T> From<AppError> for (StatusCode, Json<Response<T>>) {
    fn from(inner: AppError) -> Self {
        match inner {
            AppError::UserRepo(UserRepoError::NotFound)
            | AppError::MealRepo(MealRepoError::NotFound)
            | AppError::FoodRepo(FoodRepoError::NotFound) => (
                StatusCode::NOT_FOUND,
                Json(Response::from_err(&String::from(
                    "Requested resource Not found",
                ))),
            ),
            AppError::UserRepo(UserRepoError::InvalidUser(msg))
            | AppError::MealRepo(MealRepoError::InvalidMeal(msg))
            | AppError::FoodRepo(FoodRepoError::InvalidFood(msg)) => {
                (StatusCode::BAD_REQUEST, Json(Response::from_err(&msg)))
            }
            AppError::AuthError(msg) => (StatusCode::UNAUTHORIZED, Json(Response::from_err(&msg))),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response::from_err(&String::from("Unexpected error"))),
            ),
        }
    }
}
