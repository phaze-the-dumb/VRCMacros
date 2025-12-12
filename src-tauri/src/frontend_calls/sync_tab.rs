use chrono::Utc;
use crossbeam_channel::Sender;

use tauri::State;

use crate::{runtime::commands::RuntimeCommand, structs::nodes::Node, utils::config::Config};

#[tauri::command]
pub fn sync_tab(
  graph: Vec<Node>,
  id: String,
  name: String,
  save_state: bool,
  location: Option<String>,
  cmd: State<Sender<RuntimeCommand>>,
  conf: State<Config>,
) {
  cmd
    .send(RuntimeCommand::AddTab(graph.clone(), id.clone()))
    .unwrap();

  let mut config = conf.store.lock().unwrap();
  config.loaded_tabs.insert(id, (graph, name, location, save_state)); // TODO: When loading a tab into config, store the save state of it too

  // If we haven't updated the config in the last second, let's update it again.
  if config.last_save + 1 < Utc::now().timestamp(){ conf.save_prelocked(config); }
}

#[tauri::command]
pub fn discard_tab(id: String, cmd: State<Sender<RuntimeCommand>>, conf: State<Config>) {
  cmd.send(RuntimeCommand::RemoveTab(id.clone())).unwrap();

  let mut config = conf.store.lock().unwrap();
  config.loaded_tabs.remove(&id);
}
