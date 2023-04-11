use std::str::FromStr;

use chrono::Utc;
use mongodb::bson::doc;
// don't forget this!
use tokio_stream::StreamExt;
use uuid::Uuid;

use crate::error::{AppError, MealRepoError, Result};
use crate::food::mapper::{doc_to_food, food_to_doc};
use crate::food::model::Food;
use crate::meal::model::Meal;
use crate::meal::model::MealType;

pub async fn parse_meals(
    mut cursor: mongodb::Cursor<bson::document::Document>,
) -> Result<Vec<Meal>> {
    let mut result: Vec<Meal> = Vec::new();
    while let Some(doc) = cursor.next().await {
        result.push(doc_to_meal(&doc?)?);
    }
    Ok(result)
}

pub fn doc_to_meal(doc: &bson::document::Document) -> Result<Meal> {
    let id = doc.get_str("id")?;
    let foods: Vec<Food> = get_foods(doc);
    let meal_type = doc.get_str("meal_type")?;
    let meal_date = doc.get_str("meal_date")?;
    let created_at = doc.get_datetime("created_at")?;
    let updated_at = doc
        .get_datetime("updated_at")
        .ok()
        .map(|v| chrono::DateTime::from(*v));
    match Uuid::from_str(id) {
        Ok(meal_id) => Ok(Meal {
            id: meal_id,
            foods,
            meal_type: MealType::from_value(meal_type)?,
            meal_date: meal_date.to_string(),
            created_at: chrono::DateTime::from(created_at.clone()),
            updated_at,
        }),
        _ => Err(AppError::MealRepo(MealRepoError::DecodeError(format!(
            "Meal doesnt have id {}",
            id
        )))),
    }
}

fn get_foods(doc: &bson::document::Document) -> Vec<Food> {
    doc.get_array("foods")
        .ok()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|entry| {
            entry
                .as_document()
                .and_then(|d| doc_to_food(d).ok())
                .unwrap()
        })
        .collect()
}

pub fn meal_to_doc(meal: &Meal) -> bson::document::Document {
    doc! {
        "id" : meal.id.clone().to_string(),
        "foods" : meal.foods.iter().map(|f| food_to_doc(f)).collect::<Vec<_>>(),
        "meal_type" : meal.meal_type.to_string(),
        "meal_date" : meal.meal_date.clone(),
        "created_at" : <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(meal.created_at.clone()),
        "updated_at" : meal.updated_at.map(|v| <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(v)).clone()
    }
}
