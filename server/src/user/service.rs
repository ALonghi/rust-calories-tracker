use bson::{doc, Document};
use mongodb::Collection;
use tracing::{debug, error};

use crate::error::{AppError, Result, UserRepoError};
use crate::user::mapper::{doc_to_user, user_to_doc};
use crate::user::model::User;

pub async fn create_user(user: &User, collection: Collection<Document>) -> Result<&User> {
    debug!("[create_user] Creating user with id={}", &user.id);
    let doc = user_to_doc(user);
    collection.insert_one(doc, None).await.map_err(|_e| {
        error!("ERROR [create_user] {:?}", _e);
        return UserRepoError::InvalidUser(_e.to_string());
    })?;
    Ok(user)
}

pub async fn get_user_by_id(
    user_id: &String,
    collection: Collection<Document>,
) -> Result<Option<User>> {
    let filter = doc! { "id": user_id };
    Ok(collection
        .find_one(filter, None)
        .await
        .map_err(|e| {
            debug!(
                "Error while getting user with id {}: {}",
                user_id,
                e.to_string()
            );
            AppError::MongoError(e)
        })?
        .and_then(|doc| doc_to_user(&doc).ok()))
}
