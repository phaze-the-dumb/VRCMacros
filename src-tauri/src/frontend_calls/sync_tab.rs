use crossbeam_channel::Sender;

use tauri::State;

use crate::{ runtime::commands::RuntimeCommand, structs::nodes::Node };

#[tauri::command]
pub fn sync_tab( graph: Vec<Node>, id: String, cmd: State<Sender<RuntimeCommand>> ){
  cmd.send(RuntimeCommand::AddTab(graph, id)).unwrap();
}

#[tauri::command]
pub fn discard_tab( id: String, cmd: State<Sender<RuntimeCommand>> ){
  cmd.send(RuntimeCommand::RemoveTab(id)).unwrap();
}