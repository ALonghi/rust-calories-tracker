use std::sync::Arc;

use crate::auth::handlers::{auth, login_user_handler, register_user_handler};
use axum::{middleware, routing, routing::get, Router};

// use crate::auth::handlers::{login_handler, signup_handler};
use crate::config::AppState;
use crate::food::handlers::{
    food_create_handler, food_delete_handler, food_update_handler, get_foods_handler,
    search_foods_handler,
};
use crate::meal::handlers::{
    meal_create_handler, meal_delete_handler, meal_update_handler, search_meals_handler,
};

pub fn get_routes(app_state: Arc<AppState>) -> Router {
    let routes = Router::new()
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
        .route("/meals/search", routing::post(search_meals_handler))
        .route("/auth/login", routing::post(login_user_handler))
        .route("/auth/signup", routing::post(register_user_handler))
        // .route(
        //     "/api/auth/logout",
        //     get(logout_handler)
        //         .route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        // )
        .layer(middleware::from_fn_with_state(app_state.clone(), auth))
        .with_state(app_state);

    Router::new().nest("/api", routes)
}
