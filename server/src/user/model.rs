use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

#[skip_serializing_none]
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct User {
    pub id: uuid::Uuid,
    pub name: String,
    pub email: String,
    pub password: String,
    pub roles: Vec<String>,
    pub verified: bool,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
}

impl User {
    pub fn create(name: &String, email: &String, password: &String) -> Self {
        Self {
            id: uuid::Uuid::new_v4(),
            name: name.to_owned(),
            email: email.to_owned(),
            password: password.to_owned(),
            roles: Vec::new(),
            verified: true,
            created_at: Utc::now(),
            updated_at: None,
        }
    }
}

#[allow(non_snake_case)]
#[derive(Debug, Serialize)]
pub struct FilteredUser {
    pub id: String,
    pub name: String,
    pub email: String,
    pub roles: Vec<String>,
    pub verified: bool,
    pub createdAt: DateTime<Utc>,
    pub updatedAt: Option<DateTime<Utc>>,
}

impl FilteredUser {
    pub fn from_user(user: User) -> Self {
        Self {
            id: user.id.to_string(),
            name: user.name,
            email: user.email,
            roles: user.roles,
            verified: user.verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }
    }
}
