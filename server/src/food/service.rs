use bson::{doc, Document};
use chrono::Utc;
use mongodb::Collection;
use tracing::{debug, error};

use crate::error::AppError;
use crate::error::{FoodRepoError, Result};
use crate::food::mapper::{food_to_doc, parse_foods};
use crate::food::model::Food;

use super::mapper::doc_to_food;

pub async fn get_all_foods(collection: Collection<Document>) -> Result<Vec<Food>> {
    let mut cursor = collection.find(None, None).await.map_err(|_e| {
        debug!("ERROR [get_all_foods] {:?}", _e);
        return FoodRepoError::NotFound;
    })?;
    return parse_foods(cursor).await;
}

pub async fn create(food: &Food, collection: Collection<Document>) -> Result<&Food> {
    debug!("[create_food] Creating food with id={}", &food.id);
    let doc = food_to_doc(food);
    collection.insert_one(doc, None).await.map_err(|_e| {
        error!("ERROR [create_food] {:?}", _e);
        return FoodRepoError::InvalidFood(_e.to_string());
    })?;
    Ok(food)
}

pub async fn get_food_by_id(food_id: &String, collection: Collection<Document>) -> Result<Food> {
    let filter = doc! { "id": food_id };
    let food_opt = collection
        .find_one(filter, None)
        .await
        .map_err(|e| {
            debug!(
                "Error while getting a food with id {}: {}",
                food_id,
                e.to_string()
            );
            AppError::MongoError(e)
        })?
        .and_then(|doc| doc_to_food(&doc).ok());

    match food_opt {
        Some(food) => Ok(food),
        None => {
            debug!("food_opt is None!");
            Err(AppError::FoodRepo(FoodRepoError::NotFound))
        }
    }
}

pub async fn update(food: &Food, collection: Collection<Document>) -> Result<Food> {
    debug!("[update_food] Updating food with id={}", food.id);
    let food_id = &food.id.to_string();
    let update_time = Utc::now();
    let updated = Food {
        updated_at: Some(update_time),
        ..food.clone()
    };

    let filter = doc! { "id": food_id };
    let updates = doc! { "$set": food_to_doc(&updated) };

    collection
        .update_one(filter, updates, None)
        .await
        .map(|res| {
            return if res.modified_count == 1 {
                Ok(())
            } else {
                Err(AppError::FoodRepo(FoodRepoError::InvalidFood(format!(
                    "modified_count = {:?} on {}",
                    res.modified_count, res.matched_count
                ))))
            };
        })
        .map_err(|_e| {
            debug!("ERROR [update_food] {:?}", _e);
            return AppError::MongoError(_e);
        })?
        .expect(format!("Coudn't update food {}", food_id).as_str());

    Ok(updated)
}

pub async fn delete(food_id: &String, collection: Collection<Document>) -> Result<()> {
    debug!("[delete_food] Deleting food with id={}", food_id);
    let filter = doc! { "id": food_id };
    collection.delete_one(filter, None).await?;
    Ok(())
}
