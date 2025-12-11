use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct ConditionalIfTrue {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,
}

impl ConditionalIfTrue {
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

impl RuntimeNode for ConditionalIfTrue {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, args: Vec<ParameterType>) -> Vec<ParameterType> {
    let is_true = args[1].as_bool().unwrap();

    vec![
      ParameterType::Flow(is_true),
      ParameterType::Flow(!is_true),
    ]
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
