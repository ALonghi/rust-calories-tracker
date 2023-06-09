use bson::Document;
use std::str::FromStr;

pub fn get_optional_uuid(doc: &Document, field_name: &str) -> Option<uuid::Uuid> {
    doc.get_str(field_name)
        .ok()
        .and_then(|v| uuid::Uuid::from_str(v).ok())
}
