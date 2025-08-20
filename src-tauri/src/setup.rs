use std::sync;

use tauri::{ App, Emitter, Manager };

use crate::osc;

pub fn setup( app: &mut App ){
  let window = app.get_webview_window("main").unwrap();

  let ( sender, receiver ) = sync::mpsc::channel();

  tokio::spawn(async move {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  tokio::spawn(async move {
    loop {
      let message = receiver.recv().unwrap();



      window.emit("osc-message", message).unwrap();
    }
  });
}