use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Node {
  pub id: String,
  pub name: String,
  pub outputs: Vec<NodeOutput>,
  pub pos: [f32; 2],
  pub statics: Vec<NodeStatic>,

  #[serde(rename = "typeId")]
  pub type_id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NodeStatic {
  pub name: String,

  #[serde(rename = "type")]
  pub value_type: isize,
  pub value: Value,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NodeOutput {
  pub name: String,

  #[serde(rename = "type")]
  pub value_type: isize,
  pub connections: Vec<NodeOutputConnections>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NodeOutputConnections {
  pub name: String,
  pub node: String,
  pub index: isize,

  #[serde(rename = "type")]
  pub value_type: isize,
}
