use std::sync::Mutex;

use tauri::State;

use crate::osc::OSCMessage;

#[tauri::command]
pub fn get_addresses( addresses: State<&Mutex<Vec<OSCMessage>>> ) -> Vec<OSCMessage> {
  let addresses = addresses.lock().unwrap();
  addresses.clone()
}