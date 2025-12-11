use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct StaticInt {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,

  value: Option<i32>,
}

impl StaticInt {
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
        Some(value.as_i64().unwrap() as i32)
      }
    })
  }
}

impl RuntimeNode for StaticInt {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, _: Vec<ParameterType>) -> Vec<ParameterType> {
    if self.value.is_some() {
      vec![ParameterType::Int(self.value.clone().unwrap())]
    } else {
      vec![ParameterType::Int(0)]
    }
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
