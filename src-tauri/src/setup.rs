use std::{ fs::File, io::Read, sync::{ self, Mutex } };

use flate2::read::GzDecoder;
use serde_json::Value;
use tauri::{ App, Emitter, Listener, Manager };

use crate::osc::{ self, OSCMessage };

pub fn setup( app: &mut App, addresses: &'static Mutex<Vec<OSCMessage>> ){
  let window = app.get_webview_window("main").unwrap();

  let handle = window.clone();
  window.listen("tauri://drag-drop", move | ev | {
    let path: Value = serde_json::from_str(ev.payload()).unwrap();
    let path = path["paths"][0].as_str().unwrap();

    let file = File::open(path).unwrap();
    let mut decoder = GzDecoder::new(file);
    let mut string = String::new();

    decoder.read_to_string(&mut string).unwrap();

    handle.emit("load_new_tab", Value::String(string)).unwrap();
  });

  let ( sender, receiver ) = sync::mpsc::channel();

  tokio::spawn(async move {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  tokio::spawn(async move {
    loop {
      let message = receiver.recv().unwrap();

      window.emit("osc-message", &message).unwrap();

      let msg = message.clone();
      let mut addresses = addresses.lock().unwrap();
      if !addresses.contains(&msg){ addresses.push(msg); }
    }
  });
}