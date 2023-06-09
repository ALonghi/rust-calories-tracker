use oauth2::basic::BasicClient;
use oauth2::{AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl};

use crate::config::env::EnvVars;
use crate::error::Result;

pub mod handlers;
pub mod model;
pub mod service;
pub mod utils;

#[derive(Clone, Debug)]
pub struct AuthState {
    pub client: BasicClient,
    pub base_url: String,
    pub audience: String,
}

impl AuthState {
    pub fn init(env_vars: &EnvVars) -> Result<Self> {
        // OAuth2 configuration
        let client_id = ClientId::new(env_vars.auth_client_id.to_string());
        let client_secret = ClientSecret::new(env_vars.auth_client_secret.to_string());
        let auth_url =
            AuthUrl::new(env_vars.auth_url.to_string()).expect("Invalid authorization URL");
        let token_url = TokenUrl::new(env_vars.token_url.to_string()).expect("Invalid token URL");
        let redirect_url =
            RedirectUrl::new(env_vars.auth_redirect_url.to_string()).expect("Invalid redirect URL");
        let auth_base_url = env_vars.auth_base_url.to_string();
        let audience = env_vars.auth_audience_url.to_string();
        let client = oauth2::Client::new(client_id, Some(client_secret), auth_url, Some(token_url))
            .set_redirect_uri(redirect_url)
            .set_auth_type(oauth2::AuthType::RequestBody);

        // Create the OAuth2 client
        Ok(Self {
            client,
            base_url: auth_base_url,
            audience,
        })
    }
}
