use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use tracing::{debug, error};

use crate::config::AppState;
use crate::dto::{CreateFoodRequest, Response};
use crate::food::model::Food;
use crate::food::service as food_service;

// Returns all tasks
#[axum_macros::debug_handler]
pub async fn get_foods_handler(State(state): State<AppState>) -> impl IntoResponse {
    debug!("Getting all foods");
    match food_service::get_all_foods(state.get_foods_collection()).await {
        Ok(foods) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(foods),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[get_foods_handler] Error getting all foods: {:?}",
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
pub async fn get_food_handler(
    Path(food_id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    debug!("Getting food with id {}", food_id);
    match food_service::get_food_by_id(&food_id, state.get_foods_collection()).await {
        Ok(food) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(food),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[get_food_handler] Error getting food with id {}: {:?}",
                food_id,
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
pub async fn food_create_handler(
    State(state): State<AppState>,
    Json(req): Json<CreateFoodRequest>,
) -> impl IntoResponse {
    debug!("[task_food_handler] Creating food ({:?})", req.clone());
    let food = Food::from_create_request(req);
    match food_service::create(&food, state.get_foods_collection()).await {
        Ok(_) => (
            StatusCode::OK,
            Json(Response {
                success: true,
                data: Some(food),
                error_message: None,
            }),
        ),
        Err(e) => {
            let msg = format!(
                "[task_food_handler] Error creating food ({}) : {:?}",
                food.id,
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

// Updates existing task
pub async fn food_update_handler(
    State(state): State<AppState>,
    Json(req): Json<Food>,
) -> impl IntoResponse {
    let food_id = req.id.to_string();
    debug!("[food_update_handler] Updating food {}", food_id);
    match food_service::update(&req, state.get_foods_collection()).await {
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
                "[food_update_handler] Error updating food {}: {:?}",
                food_id,
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

// Deletes existing task
#[axum_macros::debug_handler]
pub async fn food_delete_handler(
    Path(food_id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    debug!("[task_delete_handler] Deleting food {}", food_id);
    match food_service::delete(&food_id, state.get_foods_collection()).await {
        Ok(_) => {
            let msg = format!("Deleted food with id {}", food_id);
            debug!("[food_delete_handler] {}", msg);
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
            let msg = format!("Error in deleting food {}: {}", food_id, e.to_string());
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
