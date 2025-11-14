use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct Debug {
  to_log: Option<ParameterType>,
}

impl Debug {
  pub fn new(_: Node) -> Box<Self> {
    Box::new(Self { to_log: None })
  }
}

impl RuntimeNode for Debug {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    vec![]
  }
  fn execute_dry(&mut self, _: &Vec<ParameterType>) -> Option<Vec<ParameterType>> {
    Some(vec![])
  }

  fn execute(&mut self) -> Option<Vec<ParameterType>> {
    dbg!(&self.to_log);
    self.to_log = None;

    None
  }

  fn update_arg(&mut self, index: usize, value: ParameterType) -> bool {
    if index == 1 {
      self.to_log = Some(value);
      true
    } else {
      false
    }
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
