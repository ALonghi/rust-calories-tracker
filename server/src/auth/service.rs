use bson::{doc, Document};
use mongodb::Collection;
use tracing::{debug, error};

use crate::error::{AppError, Result};
use crate::user::mapper::doc_to_user;
use crate::user::model::User;

pub async fn search_by_email(
    email: &String,
    collection: Collection<Document>,
) -> Result<Option<User>> {
    debug!("[update_food] Searching user with email={}", email);

    let filter = doc! { "email": email };
    collection
        .find_one(filter, None)
        .await
        .map_err(|e| {
            error!(
                "Error while getting user with email {}: {}",
                email,
                e.to_string()
            );
            AppError::MongoError(e)
        })
        .map(|doc_opt| doc_opt.and_then(|doc| doc_to_user(&doc).ok()))
    // .map_err(|_e| {
    //     debug!("ERROR [update_food] {:?}", _e);
    //     return AppError::MongoError(_e);
    // })
}
