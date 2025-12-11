use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct Debug {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>
}

impl Debug {
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

impl RuntimeNode for Debug {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, args: Vec<ParameterType>) -> Vec<ParameterType> {
    dbg!(&args); // TODO: Debug to actual UI instead of console
    vec![]
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
