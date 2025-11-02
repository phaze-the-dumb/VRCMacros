use crate::{ osc::OSCMessage, structs::nodes::Node };

pub enum RuntimeCommand{
  OSCMessage(OSCMessage),

  AddTab(Vec<Node>, String),
  RemoveTab(String)
}