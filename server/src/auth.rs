use mongodb::Client;
use mongodb::options::ClientOptions;

use crate::EnvVars;
use crate::error::Result;

// impl Auth {
//     pub async fn init(env_vars: &EnvVars) -> Result<Self> {
//         let google_client_id = ClientId::new(
//             env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID environment variable."),
//         );
//         let google_client_secret = ClientSecret::new(
//             env::var("GOOGLE_CLIENT_SECRET")
//                 .expect("Missing the GOOGLE_CLIENT_SECRET environment variable."),
//         );
//         let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
//             .expect("Invalid authorization endpoint URL");
//         let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
//             .expect("Invalid token endpoint URL");
//         Ok(Self {
//             client: Client::with_options(client_options)?,
//         })
//     }
// }
