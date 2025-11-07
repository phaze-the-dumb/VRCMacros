use std::collections::HashMap;

use tauri::State;

use crate::{ structs::nodes::Node, utils::config::Config };

#[tauri::command]
pub fn load_previous_tabs( conf: State<Config> ) -> HashMap<String, ( Vec<Node>, String, Option<String> )> {
  let config = conf.store.lock().unwrap();

  let tabs = config.loaded_tabs.clone();
  tabs
}