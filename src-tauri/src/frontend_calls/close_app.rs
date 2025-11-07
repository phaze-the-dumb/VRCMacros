use tauri::State;

use crate::utils::config::Config;

#[tauri::command]
pub fn close_app( conf: State<Config> ){
  conf.save();
  std::process::exit(0);
}