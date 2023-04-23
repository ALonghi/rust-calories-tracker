use std::fmt;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::dto::CreateMealRequest;
use crate::error::MealRepoError::InvalidMeal;
use crate::error::{AppError, MealRepoError, Result};
use crate::food::model::Food;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum MealType {
    Breakfast,
    Lunch,
    Dinner,
    Snack,
}

impl MealType {
    pub fn from_value(str: &str) -> Result<Self> {
        match str {
            "Breakfast" => Ok(MealType::Breakfast),
            "Lunch" => Ok(MealType::Lunch),
            "Dinner" => Ok(MealType::Dinner),
            "Snack" => Ok(MealType::Snack),
            _ => Err(AppError::from(InvalidMeal(String::from(
                "MealType not within the enum values",
            )))),
        }
    }
}

impl fmt::Display for MealType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MealType::Breakfast => write!(f, "{}", MealType::Breakfast),
            MealType::Lunch => write!(f, "{}", MealType::Lunch),
            MealType::Dinner => write!(f, "{}", MealType::Dinner),
            MealType::Snack => write!(f, "{}", MealType::Snack),
        }
    }
}

#[skip_serializing_none]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Meal {
    pub id: uuid::Uuid,
    pub food: Food,
    pub meal_type: MealType,
    pub meal_date: String,
    // date string formatted yyyy-MM-dd
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl Meal {
    pub fn from_create_request(r: CreateMealRequest) -> Self {
        Self {
            id: uuid::Uuid::new_v4(),
            food: r.food,
            meal_type: r.meal_type,
            meal_date: r.meal_date,
            created_at: Utc::now(),
            updated_at: None,
        }
    }
}
