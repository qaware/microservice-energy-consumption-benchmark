use std::fmt::{Debug};

use actix_web::HttpRequest;
use jsonwebtoken::{Algorithm, decode, decode_header, DecodingKey, Validation};
use jsonwebtoken::jwk::{CommonParameters, Jwk, JwkSet, KeyAlgorithm, PublicKeyUse, RSAKeyParameters, RSAKeyType};
use jsonwebtoken::jwk::AlgorithmParameters::RSA;
use reqwest::header;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CurrentUser {
    sub: String,
    groups: Vec<String>,
    #[serde(skip_deserializing)]
    raw_token: String,
}

impl CurrentUser {
    pub fn id(&self) -> String { self.sub.clone() }
    // TODO: pub fn in_group(&self, group: String) -> bool {        self.groups.contains(&group)     }
    pub fn raw_token(&self) -> String { self.sub.clone() }
}

// TODO: rather use a middleware
pub fn auth(req: HttpRequest) -> Option<CurrentUser> {
    let auth_value_result = req.headers().get(header::AUTHORIZATION)?.to_str();
    if auth_value_result.is_err() {
        return None;
    }
    let auth_value = auth_value_result.unwrap();
    if !auth_value.starts_with("Bearer ") {
        return None;
    }
    let token = auth_value.strip_prefix("Bearer ")?;
    let token_header = decode_header(token);
    if token_header.is_err() {
        return None;
    }
    let jwks = get_jwks();
    let jwk = jwks.find(&token_header.unwrap().kid?)?;
    let decoding_key = DecodingKey::from_jwk(jwk);
    if decoding_key.is_err() {
        return None;
    }

    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_required_spec_claims(&["exp", "iss", "aud", "sub"]);
    validation.set_issuer(&[std::env::var("AUTH_JWT_EXPECTED_ISSUER")
        .expect("AUTH_JWT_EXPECTED_ISSUER must be set")]);
    validation.set_audience(&[std::env::var("AUTH_JWT_EXPECTED_AUDIENCE")
        .expect("AUTH_JWT_EXPECTED_AUDIENCE must be set")]);

    let token_data = decode::<CurrentUser>(token, &decoding_key.unwrap(), &validation);
    if token_data.is_err() {
        return None;
    }
    let mut current_user = token_data.unwrap().claims;
    current_user.raw_token = String::from(token);
    Some(current_user)
}

// TODO: retrieve from external source
fn get_jwks() -> JwkSet {
    JwkSet {
        keys: vec![Jwk {
            common: CommonParameters {
                public_key_use: Some(PublicKeyUse::Signature),
                key_operations: None,
                key_algorithm: Some(KeyAlgorithm::RS256),
                key_id: Some(String::from("sample-id")),
                x509_url: None,
                x509_chain: None,
                x509_sha1_fingerprint: None,
                x509_sha256_fingerprint: None,
            },
            algorithm: RSA(RSAKeyParameters {
                key_type: RSAKeyType::RSA,
                n: String::from("livFI8qB4D0y2jy0CfEqFyy46R0o7S8TKpsx5xbHKoU1VWg6QkQm-ntyIv1p4kE1sPEQO73-HY8-Bzs75XwRTYL1BmR1w8J5hmjVWjc6R2BTBGAYRPFRhor3kpM6ni2SPmNNhurEAHw7TaqszP5eUF_F9-KEBWkwVta-PZ37bwqSE4sCb1soZFrVz_UT_LF4tYpuVYt3YbqToZ3pZOZ9AX2o1GCG3xwOjkc4x0W7ezbQZdC9iftPxVHR8irOijJRRjcPDtA6vPKpzLl6CyYnsIYPd99ltwxTHjr3npfv_3Lw50bAkbT4HeLFxTx4flEoZLKO_g0bAoV2uqBhkA9xnQ"),
                e: String::from("AQAB"),
            }),
        }]
    }
}
