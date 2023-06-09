use crate::error::Result;

#[derive(Clone, Debug)]
pub struct EnvVars {
    pub mongo_uri: String,
    pub app_name: String,
    pub auth_client_id: String,
    pub auth_client_secret: String,
    pub auth_redirect_url: String,
    pub auth_url: String,
    pub token_url: String,
    pub auth_base_url: String,
    pub auth_audience_url: String,
    pub jwt_secret: String,
}

impl EnvVars {
    pub fn init() -> Result<Self> {
        Ok(EnvVars {
            mongo_uri: std::env::var("MONGO_URI")
                .expect("MONGO_URI environment variable must be set."),
            app_name: std::env::var("APP_NAME")
                .expect("APP_NAME environment variable must be set."),
            auth_client_id: std::env::var("AUTH_CLIENT_ID").expect("Missing AUTH_CLIENT_ID!"),
            auth_client_secret: std::env::var("AUTH_CLIENT_SECRET")
                .expect("Missing AUTH_CLIENT_SECRET!"),
            auth_redirect_url: std::env::var("AUTH_REDIRECT_URL")
                .unwrap_or_else(|_| "http://127.0.0.1:3000/auth/authorized".to_string()),
            auth_url: std::env::var("AUTH_URL").expect("Missing AUTH_URL!"),
            token_url: std::env::var("TOKEN_URL").expect("Missing TOKEN_URL!"),
            auth_base_url: std::env::var("AUTH_BASE_URL").expect("Missing AUTH_BASE_URL!"),
            auth_audience_url: std::env::var("AUTH_AUDIENCE_URL")
                .expect("Missing AUTH_AUDIENCE_URL!"),
            jwt_secret: std::env::var("JWT_SECRET").expect("Missing JWT_SECRET!"),
        })
    }
}
