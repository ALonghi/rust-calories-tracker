use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::dto::CreateFoodRequest;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct NutritionalValue {
    pub key: String,
    pub value: f64,
}

#[skip_serializing_none]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Food {
    pub id: uuid::Uuid,
    pub grams_qty: f64,
    pub calories_qty: Option<i32>,
    pub nutritional_values: Vec<NutritionalValue>,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl Food {
    pub fn from_create_request(r: CreateFoodRequest) -> Self {
        Self {
            id: uuid::Uuid::new_v4(),
            grams_qty: r.grams_qty,
            calories_qty: r.calories_qty,
            nutritional_values: r.nutritional_values,
            created_at: Utc::now(),
            updated_at: None,
        }
    }
}
