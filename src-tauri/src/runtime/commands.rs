use crate::{ osc::OSCMessage, structs::nodes::Node };

#[derive(Debug)]
pub enum RuntimeCommand{
  OSCMessage(OSCMessage),

  AddTab(Vec<Node>, String),
  RemoveTab(String)
}