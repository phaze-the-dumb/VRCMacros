use crossbeam_channel::Sender;

use tauri::State;

use crate::{ runtime::commands::RuntimeCommand, structs::nodes::Node, utils::config::Config };

#[tauri::command]
pub fn sync_tab( graph: Vec<Node>, id: String, name: String, location: Option<String>, cmd: State<Sender<RuntimeCommand>>, conf: State<Config> ){
  cmd.send(RuntimeCommand::AddTab(graph.clone(), id.clone())).unwrap();

  let mut config = conf.store.lock().unwrap();
  config.loaded_tabs.insert(id, ( graph, name, location ));
  drop(config);

  conf.save();
}

#[tauri::command]
pub fn discard_tab( id: String, cmd: State<Sender<RuntimeCommand>>, conf: State<Config> ){
  cmd.send(RuntimeCommand::RemoveTab(id.clone())).unwrap();

  let mut config = conf.store.lock().unwrap();
  config.loaded_tabs.remove(&id);
  drop(config);

  conf.save();
}