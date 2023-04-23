use axum::routing::get;
use axum::{routing, Router};

use crate::config::AppState;
use crate::food::handlers::{
    food_create_handler, food_delete_handler, food_update_handler, get_foods_handler,
    search_foods_handler,
};
use crate::meal::handlers::{
    get_meals_handler, meal_create_handler, meal_delete_handler, meal_update_handler,
    search_meals_handler,
};

pub fn get_routes() -> Router<AppState> {
    let api_routes: Router<AppState> = Router::new()
        .route(
            "/foods",
            get(get_foods_handler)
                .post(food_create_handler)
                .put(food_update_handler)
                .delete(food_delete_handler),
        )
        .route(
            "/meals",
            routing::post(meal_create_handler)
                .put(meal_update_handler)
                .delete(meal_delete_handler),
        )
        .route("/foods/search", routing::post(search_foods_handler))
        .route("/meals/search", routing::post(search_meals_handler));

    Router::new().nest("/api", api_routes)
}
