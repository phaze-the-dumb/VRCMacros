use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct StaticFloat {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,

  value: Option<f32>,
}

impl StaticFloat {
  pub fn new(node: Node) -> Box<Self> {
    let value = &node.statics[0].value;

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

      value: if value.is_null() {
        None
      } else {
        Some(value.as_f64().unwrap() as f32)
      }
    })
  }
}

impl RuntimeNode for StaticFloat {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, _: Vec<ParameterType>) -> Vec<ParameterType> {
    if self.value.is_some() {
      vec![ParameterType::Float(self.value.clone().unwrap())]
    } else {
      vec![ParameterType::Float(0.0)]
    }
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
