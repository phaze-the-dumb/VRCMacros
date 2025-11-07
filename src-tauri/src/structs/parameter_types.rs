use serde::Serialize;

#[derive(Serialize, Clone, Debug, PartialEq)]
#[serde(tag = "key", content = "value")]
pub enum ParameterType {
  AnyType(String),
  Label(&'static str),

  Int(i32),
  Float(f32),
  Boolean(bool),
  String(String),
  Flow(bool),

  None
}
