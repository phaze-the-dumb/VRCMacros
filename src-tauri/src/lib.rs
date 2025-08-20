use std::fs;

use sqlx::{ migrate::MigrateDatabase, Sqlite, SqlitePool };

use crate::{ setup::setup, utils::config::Config };

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

  let db_file = container_folder.join("VRCMacros.db");
  if !db_file.exists(){ Sqlite::create_database(db_file.to_str().unwrap()).await.unwrap(); }

  let conf_file = container_folder.join("VRCMacros.json");
  if !conf_file.exists(){ fs::write(&conf_file, "{}").unwrap() }

  let pool = SqlitePool::connect(db_file.to_str().unwrap()).await.unwrap();
  let conf = Config::new(conf_file);

  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![])
    .manage(pool)
    .manage(conf)
    .setup(| app | {
      setup(app);

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}