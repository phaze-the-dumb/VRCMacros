use std::{io::Stdin, process::{Command, Stdio}};

use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct ShellCommand {
  outputs: Vec<Vec<(String, isize, isize)>>,
  inputs: Vec<Option<(String, isize, isize)>>
}

impl ShellCommand {
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
      }).collect()
    })
  }
}

impl RuntimeNode for ShellCommand {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    self.outputs.clone()
  }

  fn inputs(&self) -> Vec<Option<(String, isize, isize)>> {
    self.inputs.clone()
  }

  fn execute(&mut self, args: Vec<ParameterType>) -> Vec<ParameterType> {
    if let Ok(cmd) = args[1].as_string(){
      if cmd != ""{
        let mut split_cmd = cmd.split(" ");

        let mut cmd = Command::new(split_cmd.nth(0).unwrap());
        if split_cmd.clone().count() > 0{ cmd.args(split_cmd); }

        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        let child = cmd.spawn().unwrap();
        let output = child.wait_with_output().unwrap();

        vec![
          ParameterType::Flow(true),
          ParameterType::String(str::from_utf8(&output.stdout).unwrap().to_owned())
        ]
      } else{
        vec![ ParameterType::Flow(false) ]
      }
    } else{
      vec![ ParameterType::Flow(false) ]
    }
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
