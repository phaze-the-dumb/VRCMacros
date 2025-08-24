use std::sync::Mutex;

use tauri::State;

#[tauri::command]
pub fn get_addresses( addresses: State<&Mutex<Vec<String>>> ) -> Vec<String> {
  let addresses = addresses.lock().unwrap();
  addresses.clone()
}