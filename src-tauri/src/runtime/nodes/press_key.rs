use std::sync::{Arc, Mutex};

use enigo::{Direction, Enigo, Key, Keyboard};

use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct PressKey {
  key: Option<char>,
  enigo: Arc<Mutex<Enigo>>,
}

impl PressKey {
  pub fn new(node: Node, enigo: Arc<Mutex<Enigo>>) -> Box<Self> {
    let value = &node.statics[0].value;

    Box::new(Self {
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
    vec![]
  }
  fn execute_dry(&mut self, _: &Vec<ParameterType>) -> Option<Vec<ParameterType>> {
    Some(vec![])
  }

  fn execute(&mut self) -> Option<Vec<ParameterType>> {
    if self.key.is_some() {
      let mut enigo = self.enigo.lock().unwrap();
      enigo.key(Key::MediaPlayPause, Direction::Click).unwrap();
    }

    None
  }

  fn update_arg(&mut self, _: usize, _: ParameterType) -> bool {
    false
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
