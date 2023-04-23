use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::food::model::{Food, NutritionalValue};
use crate::meal::model::MealType;

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Response<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error_message: Option<String>,
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
