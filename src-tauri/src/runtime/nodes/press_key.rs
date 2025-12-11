use std::sync::{Arc, Mutex};

use enigo::{Direction, Enigo, Key, Keyboard};

use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct PressKey {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>,

  key: Option<char>,
  enigo: Arc<Mutex<Enigo>>,
}

impl PressKey {
  pub fn new(node: Node, enigo: Arc<Mutex<Enigo>>) -> Box<Self> {
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

      enigo,
      key: if value.is_null() {
        None
      } else {
        let string = value.as_str().unwrap().to_owned();

        if string.len() == 1 {
          Some(string.chars().nth(0).unwrap())
        } else {
          None
        }
      },
    })
  }
}

impl RuntimeNode for PressKey {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, _: Vec<ParameterType>) -> Vec<ParameterType> {
    if self.key.is_some() {
      let mut enigo = self.enigo.lock().unwrap();
      enigo.key(Key::MediaPlayPause, Direction::Click).unwrap();
    }

    vec![]
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
