use std::vec;

use crate::{
  osc,
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct OSCActionsSendChatbox {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,
}

impl OSCActionsSendChatbox {
  pub fn new(node: Node) -> Box<Self> {
    Box::new(Self {
      outputs: node.outputs.iter().map(|x| {
        x.connections.iter()
          .map(|x| (x.node.clone(), x.index, x.value_type)).collect()}).collect(),

      inputs: node.inputs.iter().map(|x| {
        let y = x.connections.get(0);
        if let Some(y) = y{
          Some((y.node.clone(), y.index, y.value_type))
        } else{
          None
        }
      }).collect(),
    })
  }
}

impl RuntimeNode for OSCActionsSendChatbox {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, args: Vec<ParameterType>) -> Vec<ParameterType> {
    if let Ok(msg) = args[1].as_string(){
      osc::send_message(
        "/chatbox/input",
        vec![
          ParameterType::String(msg.clone()),
          ParameterType::Boolean(true),
          ParameterType::Boolean(false),
        ],
        "127.0.0.1:9000",
      );
    }

    vec![]
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
