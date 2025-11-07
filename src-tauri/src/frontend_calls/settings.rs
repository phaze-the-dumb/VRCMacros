use tauri::State;

use crate::utils::config::Config;

#[tauri::command]
pub fn set_hide_editor_on_app_start( value: bool, conf: State<Config> ){
  let mut config = conf.store.lock().unwrap();
  config.hide_editor_on_start = value;
}

#[tauri::command]
pub fn get_hide_editor_on_app_start( conf: State<Config> ) -> bool {
  let mut config = conf.store.lock().unwrap();
  config.hide_editor_on_start
}