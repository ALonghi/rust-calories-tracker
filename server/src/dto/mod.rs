use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::food::model::{Food, NutritionalValue};
use crate::meal::model::MealType;
use crate::user::model::FilteredUser;

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Response<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error_message: Option<String>,
}

impl<T> Response<T> {
    pub fn from_data(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error_message: None,
        }
    }
    pub fn from_err(err: &String) -> Self {
        Self {
            success: false,
            data: None,
            error_message: Some(err.to_owned()),
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, Debug, Clone)]
pub struct CreateFoodRequest {
    pub name: String,
    pub grams_qty: f64,
    pub calories_qty: Option<i32>,
    pub nutritional_values: Vec<NutritionalValue>,
}

#[skip_serializing_none]
#[derive(Deserialize, Debug, Clone)]
pub struct CreateMealRequest {
    pub food: Food,
    pub meal_type: MealType,
    pub meal_date: String,
}

#[skip_serializing_none]
#[derive(Deserialize, Debug, Clone)]
pub struct SearchMealRequest {
    pub meal_date: Option<String>,
}

#[skip_serializing_none]
#[derive(Deserialize, Debug, Clone)]
pub struct SearchFoodRequest {
    pub food_prefix: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct UserCreationRequest {
    pub email: String,
    pub password: String,
}

#[derive(Clone, Serialize, Debug)]
pub struct AuthData {
    pub token: String,
    pub user: FilteredUser,
}
#[derive(Clone, Serialize, Debug)]
pub struct LoginResponse {
    pub data: AuthData,
    pub success: bool,
}
