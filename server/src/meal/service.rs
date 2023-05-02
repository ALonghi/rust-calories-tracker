use bson::{doc, Document};
use chrono::Utc;
use mongodb::Collection;
use tracing::{debug, error};

use crate::error::AppError;
use crate::error::{MealRepoError, Result};
use crate::meal::mapper::{meal_to_doc, parse_meals};
use crate::meal::model::Meal;

use super::mapper::doc_to_meal;

pub async fn get_all_meals(collection: Collection<Document>) -> Result<Vec<Meal>> {
    let cursor = collection.find(None, None).await.map_err(|_e| {
        debug!("ERROR [get_all_meals] {:?}", _e);
        return MealRepoError::NotFound;
    })?;
    return parse_meals(cursor).await;
}

pub async fn create(meal: &Meal, collection: Collection<Document>) -> Result<&Meal> {
    debug!("[create_meal] Creating meal with id={}", &meal.id);
    let doc = meal_to_doc(meal);
    collection.insert_one(doc, None).await.map_err(|_e| {
        error!("ERROR [create_meal] {:?}", _e);
        return MealRepoError::InvalidMeal(_e.to_string());
    })?;
    Ok(meal)
}

pub async fn get_meal_by_id(meal_id: &String, collection: Collection<Document>) -> Result<Meal> {
    let filter = doc! { "id": meal_id };
    let meal_opt = collection
        .find_one(filter, None)
        .await
        .map_err(|e| {
            debug!(
                "Error while getting a meal with id {}: {}",
                meal_id,
                e.to_string()
            );
            AppError::MongoError(e)
        })?
        .and_then(|doc| doc_to_meal(&doc).ok());

    match meal_opt {
        Some(meal) => Ok(meal),
        None => {
            debug!("meal_opt is None!");
            Err(AppError::MealRepo(MealRepoError::NotFound))
        }
    }
}

pub async fn get_meals_by_date(
    date: &String,
    collection: Collection<Document>,
) -> Result<Vec<Meal>> {
    let filter = doc! { "meal_date": date };
    let cursor = collection.find(filter, None).await.map_err(|_e| {
        debug!("ERROR [get_meals_by_date] {:?}", _e);
        return MealRepoError::NotFound;
    })?;
    return parse_meals(cursor).await;
}

pub async fn update(meal: &Meal, collection: Collection<Document>) -> Result<Meal> {
    debug!("[update_meal] Updating meal with id={}", meal.id);
    let meal_id = &meal.id.to_string();
    let update_time = Utc::now();
    let updated = Meal {
        updated_at: Some(update_time),
        ..meal.clone()
    };

    let filter = doc! { "id": meal_id };
    let updates = doc! { "$set": meal_to_doc(&updated) };

    collection
        .update_one(filter, updates, None)
        .await
        .map(|res| {
            return if res.modified_count == 1 {
                Ok(())
            } else {
                Err(AppError::MealRepo(MealRepoError::InvalidMeal(format!(
                    "modified_count = {:?} on {}",
                    res.modified_count, res.matched_count
                ))))
            };
        })
        .map_err(|_e| {
            debug!("ERROR [update_meal] {:?}", _e);
            return AppError::MongoError(_e);
        })?
        .expect(format!("Coudn't update meal {}", meal_id).as_str());

    Ok(updated)
}

pub async fn delete(meal_id: &String, collection: Collection<Document>) -> Result<()> {
    debug!("[delete_meal] Deleting meal with id={}", meal_id);
    let filter = doc! { "id": meal_id };
    collection.delete_one(filter, None).await?;
    Ok(())
}
