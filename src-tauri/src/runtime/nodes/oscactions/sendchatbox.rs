use std::vec;

use crate::{
  osc,
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct OSCActionsSendChatbox {
  to_log: String,
}

impl OSCActionsSendChatbox {
  pub fn new(_: Node) -> Box<Self> {
    Box::new(Self { to_log: "".into() })
  }
}

impl RuntimeNode for OSCActionsSendChatbox {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    vec![]
  }
  fn execute_dry(&mut self, _: &Vec<ParameterType>) -> Option<Vec<ParameterType>> {
    Some(vec![])
  }

  fn execute(&mut self) -> Option<Vec<ParameterType>> {
    osc::send_message(
      "/chatbox/input",
      vec![
        ParameterType::String(self.to_log.clone()),
        ParameterType::Boolean(true),
        ParameterType::Boolean(false),
      ],
      "127.0.0.1:9000",
    );

    None
  }

  fn update_arg(&mut self, index: usize, value: ParameterType) -> bool {
    if index == 1 {
      self.to_log = value.as_string().unwrap();
      true
    } else {
      false
    }
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
