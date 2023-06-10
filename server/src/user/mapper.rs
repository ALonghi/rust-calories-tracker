use std::str::FromStr;

use axum::extract::FromRef;
use chrono::Utc;
use mongodb::bson::doc;
// don't forget this!
use tokio_stream::StreamExt;
use uuid::Uuid;

use crate::error::{AppError, Result, UserRepoError};
use crate::user::model::User;

pub async fn parse_users(
    mut cursor: mongodb::Cursor<bson::document::Document>,
) -> Result<Vec<User>> {
    let mut result: Vec<User> = Vec::new();
    while let Some(doc) = cursor.next().await {
        result.push(doc_to_user(&doc?)?);
    }
    Ok(result)
}

pub fn doc_to_user(doc: &bson::document::Document) -> Result<User> {
    let id = doc.get_str("id")?;
    let name = doc.get_str("name")?;
    let email = doc.get_str("email")?;
    let password = doc.get_str("password")?;
    let roles = doc.get_array("roles")?;
    let verified = doc.get_bool("verified")?;
    let created_at = bson::DateTime::from_ref(doc.get_datetime("created_at")?);
    let updated_at = doc
        .get_datetime("updated_at")
        .ok()
        .map(|v| chrono::DateTime::from(*v));
    match Uuid::from_str(id) {
        Ok(user_id) => Ok(User {
            id: user_id,
            name: String::from(name),
            email: String::from(email),
            password: String::from(password),
            roles: roles.to_vec().into_iter().map(|u| u.to_string()).collect(),
            verified,
            created_at: chrono::DateTime::from(created_at),
            updated_at,
        }),
        _ => Err(AppError::from(UserRepoError::DecodeError(format!(
            "User doesnt have id {}",
            id
        )))),
    }
}

pub fn user_to_doc(user: &User) -> bson::document::Document {
    doc! {
        "id" : user.id.clone().to_string(),
        "name" : user.name.clone(),
        "email" : user.email.clone(),
        "password" : user.password.clone(),
        "roles" : user.roles.clone(),
        "verified" : user.verified.clone(),
        "created_at" : <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(user.created_at),
        "updated_at" : user.updated_at.map(|v| <chrono::DateTime<Utc> as Into<bson::DateTime>>::into(v)).clone()
    }
}
