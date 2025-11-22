use std::{
  collections::HashMap,
  sync::{Arc, Mutex},
};

#[cfg(target_os = "windows")]
use enigo::Enigo;

use crate::{
  runtime::nodes::{
    conditional::{
      ifequal::ConditionalIfEqual, iffalse::ConditionalIfFalse, iftrue::ConditionalIfTrue,
    }, debug::Debug, oscactions::sendchatbox::OSCActionsSendChatbox, osctrigger::OSCTrigger, shell::ShellCommand, statics::{float::StaticFloat, int::StaticInt, string::StaticString}
  },
  structs::{nodes::Node, parameter_types::ParameterType},
};

#[cfg(target_os = "windows")]
use crate::runtime::nodes::press_key::PressKey;

mod conditional;
mod debug;
mod oscactions;
mod osctrigger;
mod statics;
mod shell;

#[cfg(target_os = "windows")]
mod press_key;

pub struct RuntimeNodeTree {
  pub nodes: HashMap<String, Box<dyn RuntimeNode>>,
}

unsafe impl Send for RuntimeNodeTree {}

impl RuntimeNodeTree {
  pub fn from(tree: Vec<Node>, #[cfg(target_os = "windows")] enigo: Arc<Mutex<Enigo>>) -> Self {
    let mut runtime_nodes: HashMap<String, Box<dyn RuntimeNode>> = HashMap::new();
    for node in tree {
      match node.type_id.as_str() {
        "osctrigger" => {
          runtime_nodes.insert(node.id.clone(), OSCTrigger::new(node));
        }

        "staticstring" => {
          runtime_nodes.insert(node.id.clone(), StaticString::new(node));
        }
        "staticint" => {
          runtime_nodes.insert(node.id.clone(), StaticInt::new(node));
        }
        "staticfloat" => {
          runtime_nodes.insert(node.id.clone(), StaticFloat::new(node));
        }

        "iftrue" => {
          runtime_nodes.insert(node.id.clone(), ConditionalIfTrue::new(node));
        }
        "iffalse" => {
          runtime_nodes.insert(node.id.clone(), ConditionalIfFalse::new(node));
        }
        "ifequal" => {
          runtime_nodes.insert(node.id.clone(), ConditionalIfEqual::new(node));
        }

        "oscsendchatbox" => {
          runtime_nodes.insert(node.id.clone(), OSCActionsSendChatbox::new(node));
        }

        "debug" => {
          runtime_nodes.insert(node.id.clone(), Debug::new(node));
        }

        #[cfg(target_os = "windows")]
        "presskey" => {
          runtime_nodes.insert(node.id.clone(), PressKey::new(node, enigo.clone()));
        }

        "shellcommand" => {
          runtime_nodes.insert(node.id.clone(), ShellCommand::new(node));
        }

        _ => {}
      }
    }

    Self {
      nodes: runtime_nodes,
    }
  }
}

pub trait RuntimeNode {
  fn outputs(&self) -> Vec<Vec<(String, isize, isize)>>; // Node ID, input index, output value type
  fn execute_dry(&mut self, msg: &Vec<ParameterType>) -> Option<Vec<ParameterType>>; // Only update values on the first loop through
  fn execute(&mut self) -> Option<Vec<ParameterType>>; // Then call functions on the second loop
  fn update_arg(&mut self, index: usize, value: ParameterType) -> bool;
  fn is_entrypoint(&self) -> bool;
}
