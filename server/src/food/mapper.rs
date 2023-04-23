use std::str::FromStr;

use axum::extract::FromRef;
use chrono::Utc;
use mongodb::bson::doc;
// don't forget this!
use tokio_stream::StreamExt;
use uuid::Uuid;

use crate::error::{AppError, FoodRepoError, Result};
use crate::food::model::{Food, NutritionalValue};

pub async fn parse_foods(
    mut cursor: mongodb::Cursor<bson::document::Document>,
) -> Result<Vec<Food>> {
    let mut result: Vec<Food> = Vec::new();
    while let Some(doc) = cursor.next().await {
        result.push(doc_to_food(&doc?)?);
    }
    Ok(result)
}

pub fn doc_to_food(doc: &bson::document::Document) -> Result<Food> {
    let id = doc.get_str("id")?;
    let name = doc.get_str("name")?;
    let grams_qty = doc.get_f64("grams_qty")?;
    let calories_qty = doc.get_i32("calories_qty").ok();
    let nutritional_values = get_nutritional_values(doc);
    let created_at = bson::DateTime::from_ref(doc.get_datetime("created_at")?);
    let updated_at = doc
        .get_datetime("updated_at")
        .ok()
        .map(|v| chrono::DateTime::from(*v));
    match Uuid::from_str(id) {
        Ok(food_id) => Ok(Food {
            id: food_id,
            name: String::from(name),
            grams_qty,
            calories_qty,
            nutritional_values,
            created_at: chrono::DateTime::from(created_at),
            updated_at,
        }),
        _ => Err(AppError::FoodRepo(FoodRepoError::DecodeError(format!(
            "Food doesnt have id {}",
            id
        )))),
    }
}

fn map_nutritional_values_to_docs(values: &Vec<NutritionalValue>) -> Vec<bson::document::Document> {
    return values
        .into_iter()
        .map(|nutritional_value| {
            doc! {
            "key" : &nutritional_value.key,
            "value" : &nutritional_value.value,
            }
        })
        .clone()
        .collect();
}

fn get_nutritional_values(doc: &bson::document::Document) -> Vec<NutritionalValue> {
    doc.get_array("nutritional_values")
        .ok()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|entry| {
            entry
                .as_document()
                .map(|d| NutritionalValue {
                    key: String::from(d.get_str("key").unwrap()),
                    value: d.get_f64("value").unwrap_or(0 as f64).into(),
                })
                .unwrap()
        })
        .collect()
}

pub fn food_to_doc(food: &Food) -> bson::document::Document {
    doc! {
        "id" : food.id.clone().to_string(),
        "name" : food.name.clone(),
        "grams_qty" : food.grams_qty,
        "calories_qty" : food.calories_qty,
        "nutritional_values" : map_nutritional_values_to_docs(&food.nutritional_values),
        "created_at" : <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(food.created_at),
        "updated_at" : food.updated_at.map(|v| <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(v)).clone()
    }
}
