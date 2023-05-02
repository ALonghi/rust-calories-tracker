use mongodb::options::ClientOptions;
use mongodb::Client;

use crate::error::Result;
use crate::EnvVars;

#[derive(Clone, Debug)]
pub struct DB {
    pub client: Client,
}

impl DB {
    pub async fn init(env_vars: &EnvVars) -> Result<Self> {
        let client_options = ClientOptions::parse(format!(
            "{}/?retryWrites=true&w=majority&appname={}",
            env_vars.mongo_uri, env_vars.app_name
        ))
        .await?;
        Ok(Self {
            client: Client::with_options(client_options)?,
        })
    }
}
