use std::sync::{self, Mutex};

use tauri::{ App, Emitter, Manager };

use crate::{ osc };

pub fn setup( app: &mut App, addresses: &'static Mutex<Vec<String>> ){
  let window = app.get_webview_window("main").unwrap();

  let ( sender, receiver ) = sync::mpsc::channel();

  tokio::spawn(async move {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  tokio::spawn(async move {
    loop {
      let message = receiver.recv().unwrap();

      window.emit("osc-message", &message).unwrap();

      let addr = message.address.clone();
      let mut addresses = addresses.lock().unwrap();
      if !addresses.contains(&addr){ addresses.push(addr); }
    }
  });
}