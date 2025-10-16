use std::{ fs, sync::Mutex };

use frontend_calls::*;

use crate::{ osc::OSCMessage, setup::setup, utils::config::Config };

mod frontend_calls;
mod structs;
mod setup;
mod utils;
mod osc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
  let container_folder = dirs::config_dir().unwrap().join("VRCMacros");

  match fs ::metadata(&container_folder){
    Ok(meta) => {
      if meta.is_file(){
        panic!("document.write('Cannot launch app as the container path is a file not a directory')");
      }
    }
    Err(_) => {
      fs::create_dir(&container_folder).unwrap();
    }
  }

  let conf_file = container_folder.join("conf");
  let conf = Config::new(conf_file);

  static ADDRESSES: Mutex<Vec<OSCMessage>> = Mutex::new(Vec::new());

  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      get_addresses::get_addresses,
    ])
    .manage(conf)
    .manage(&ADDRESSES)
    .setup(| app | {
      setup(app, &ADDRESSES);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}