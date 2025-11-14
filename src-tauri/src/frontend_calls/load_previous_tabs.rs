use std::collections::HashMap;

use tauri::{State, Window};

use crate::{structs::nodes::Node, utils::config::Config};

#[tauri::command]
pub fn load_previous_tabs(
  window: Window,
  conf: State<Config>,
) -> HashMap<String, (Vec<Node>, String, Option<String>)> {
  let config = conf.store.lock().unwrap();

  if !config.hide_editor_on_start {
    window.show().unwrap();
  }

  let tabs = config.loaded_tabs.clone();
  tabs
}
