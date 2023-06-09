use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use std::sync::Arc;
use tracing::{debug, error};

use crate::config::AppState;
use crate::dto::{CreateMealRequest, Response, SearchMealRequest};
use crate::meal::model::Meal;
use crate::meal::service as meal_service;

// Returns all meals
#[axum_macros::debug_handler]
pub async fn get_meals_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    debug!("Getting all meals");
    match meal_service::get_all_meals(state.get_meals_collection()).await {
        Ok(meals) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(meals),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[get_meals_handler] Error getting all meals: {:?}",
                e.to_string()
            );
            error!("{}", msg);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response {
                    success: false,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}

#[axum_macros::debug_handler]
pub async fn search_meals_handler(
    State(state): State<Arc<AppState>>,
    Json(req): Json<SearchMealRequest>,
) -> impl IntoResponse {
    debug!("searching meal with request {:?}", req.clone());
    let fetch_meals = match &req.meal_date {
        Some(date) => meal_service::get_meals_by_date(date, state.get_meals_collection()).await,
        None => meal_service::get_all_meals(state.get_meals_collection()).await,
    };
    match fetch_meals {
        Ok(meals) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(meals),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[search_meals_handler] Error searching meals with search req ({:?}): {:?}",
                req.clone(),
                e.to_string()
            );
            error!("{}", msg);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response {
                    success: false,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}

#[axum_macros::debug_handler]
pub async fn get_meal_handler(
    Path(meal_id): Path<String>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    debug!("Getting meal with id {}", meal_id);
    match meal_service::get_meal_by_id(&meal_id, state.get_meals_collection()).await {
        Ok(meal) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(meal),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[get_meal_handler] Error getting meal with id {}: {:?}",
                meal_id,
                e.to_string()
            );
            error!("{}", msg);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response {
                    success: false,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}

#[axum_macros::debug_handler]
pub async fn meal_create_handler(
    State(state): State<Arc<AppState>>,
    Json(req): Json<CreateMealRequest>,
) -> impl IntoResponse {
    debug!("[meal_meal_handler] Creating meal ({:?})", req.clone());
    let meal = Meal::from_create_request(req);
    match meal_service::create(&meal, state.get_meals_collection()).await {
        Ok(_) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(meal),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[meal_meal_handler] Error creating meal ({}) : {:?}",
                meal.id,
                e.to_string()
            );
            error!("{}", msg);
            (
                StatusCode::BAD_REQUEST,
                Json(Response {
                    success: false,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}

// Updates existing meal
pub async fn meal_update_handler(
    State(state): State<Arc<AppState>>,
    Json(req): Json<Meal>,
) -> impl IntoResponse {
    let meal_id = req.id.to_string();
    debug!("[meal_update_handler] Updating meal {}", meal_id);
    match meal_service::update(&req, state.get_meals_collection()).await {
        Ok(b) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(b),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[meal_update_handler] Error updating meal {}: {:?}",
                meal_id,
                e.to_string()
            );
            error!("{}", msg);
            (
                StatusCode::BAD_REQUEST,
                Json(Response {
                    success: false,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}

// Deletes existing meal
#[axum_macros::debug_handler]
pub async fn meal_delete_handler(
    path: Path<String>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let meal_id = path.0;
    debug!("[meal_delete_handler] Deleting meal {}", meal_id);
    match meal_service::delete(&meal_id, state.get_meals_collection()).await {
        Ok(_) => {
            let msg = format!("Deleted meal with id {}", meal_id);
            debug!("[meal_delete_handler] {}", msg);
            (
                StatusCode::OK,
                Json(Response {
                    success: true,
                    data: Some(msg),
                    error_message: None,
                }),
            )
        }
        Err(e) => {
            let msg = format!("Error in deleting meal {}: {}", meal_id, e.to_string());
            error!("{}", msg);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(Response {
                    success: true,
                    data: None,
                    error_message: Some(msg),
                }),
            )
        }
    }
}
