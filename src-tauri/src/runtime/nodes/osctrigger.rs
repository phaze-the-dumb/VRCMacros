use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct OSCTrigger {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,

  address: Option<String>
}

impl OSCTrigger {
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

      address: if value.is_null() {
        None
      } else {
        Some(value.as_str().unwrap().to_owned())
      },
    })
  }
}

impl RuntimeNode for OSCTrigger {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, mut args: Vec<ParameterType>) -> Vec<ParameterType> {
    if args.len() == 0{ return args }

    let execute = if let Some(internal_address) = &self.address {
      if let Ok(address) = args[0].as_string() {
        address == *internal_address
      } else{
        false
      }
    } else{
      false
    };

    args[0] = ParameterType::Flow(execute);
    args
  }

  fn is_entrypoint(&self) -> bool {
    true
  }
}
