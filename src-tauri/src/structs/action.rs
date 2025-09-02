use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(tag = "key", content = "value")]
pub enum ActionParameters{
  AnyType,
  Int,
  String,
  Float,
  Boolean,
  Actions,
  Label(&'static str)
}

#[derive(Serialize, Clone)]
pub struct Action{
  pub name: String,
  pub parameters: Vec<ActionParameters>
}