use std::process::Command;

use crate::{
  runtime::nodes::RuntimeNode,
  structs::{nodes::Node, parameter_types::ParameterType},
};

pub struct ShellCommand {
  cmd: String
}

impl ShellCommand {
  pub fn new(node: Node) -> Box<Self> {
    Box::new(Self {
      cmd: "".to_owned()
    })
  }
}

impl RuntimeNode for ShellCommand {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>> {
    vec![]
  }
  fn execute_dry(&mut self, _: &Vec<ParameterType>) -> Option<Vec<ParameterType>> {
    Some(vec![])
  }

  fn execute(&mut self) -> Option<Vec<ParameterType>> {
    dbg!(&self.cmd);

    if self.cmd != ""{
      let mut split_cmd = self.cmd.split(" ");

      let mut cmd = Command::new(split_cmd.nth(0).unwrap());
      if split_cmd.clone().count() > 0{ cmd.args(split_cmd); }

      let child = cmd.spawn().unwrap();
      let output = child.wait_with_output().unwrap();

      self.cmd = "".to_owned();

      Some(vec![
        ParameterType::Flow(true),
        ParameterType::String(str::from_utf8(&output.stdout).unwrap().to_owned())
      ])
    } else{
      None
    }
  }

  fn update_arg(&mut self, index: usize, arg: ParameterType) -> bool {
    if index == 1{
      if let ParameterType::String(cmd) = arg {
        self.cmd = cmd;
      }
    }

    false
  }

  fn is_entrypoint(&self) -> bool {
    false
  }
}
