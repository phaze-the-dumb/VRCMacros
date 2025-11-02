use std::{collections::HashMap, sync::Mutex};

use crate::{ runtime::nodes::{ debug::Debug, osctrigger::OSCTrigger }, structs::{ nodes::Node, parameter_types::ParameterType } };

mod osctrigger;
mod debug;

pub struct RuntimeNodeTree{
  pub nodes: HashMap<String, Mutex<Box<dyn RuntimeNode>>>
}

impl RuntimeNodeTree{
  pub fn from( tree: Vec<Node> ) -> Self{
    let mut runtime_nodes: HashMap<String, Mutex<Box<dyn RuntimeNode>>> = HashMap::new();
    for node in tree{
      match node.type_id.as_str(){
        "osctrigger" => { runtime_nodes.insert(node.id.clone(), Mutex::new(OSCTrigger::new(node))); }
        "debug" => { runtime_nodes.insert(node.id.clone(), Mutex::new(Debug::new(node))); }
        _ => {}
      }
    }

    Self { nodes: runtime_nodes }
  }
}

pub trait RuntimeNode{
  fn outputs( &self ) -> Vec<Vec<( String, isize, isize )>>; // Node ID, input index, output value type
  fn execute_dry( &mut self, msg: &Vec<ParameterType> ) -> Option<Vec<ParameterType>>; // Only update values on the first loop through
  fn execute( &mut self ) -> bool; // Then call functions on the second loop
  fn update_arg( &mut self, index: usize, value: ParameterType ) -> bool;
  fn is_entrypoint( &self ) -> bool;
}