use crossbeam_channel::{bounded, Receiver};
use std::{collections::HashMap, fs::File, io::Read, sync::Mutex};

use flate2::read::GzDecoder;
use serde_json::{Map, Value};
use tauri::{App, Emitter, Listener, Manager, WindowEvent};

use crate::{
  osc::{self, OSCMessage},
  runtime::{commands::RuntimeCommand, nodes::RuntimeNodeTree, runtime, runtime_dry},
  structs::parameter_types::ParameterType,
  utils::setup_traymenu::setup_traymenu,
};

pub fn setup(
  app: &mut App,
  addresses: &'static Mutex<Vec<OSCMessage>>,
  runtime_command_receiver: Receiver<RuntimeCommand>,
) {
  let window = app.get_webview_window("main").unwrap();
  window.hide().unwrap();

  let win_handle = window.clone();
  window.on_window_event(move |event| match event {
    WindowEvent::CloseRequested { api, .. } => {
      api.prevent_close();

      win_handle.hide().unwrap();
      win_handle.emit("hide-window", ()).unwrap();
    }
    _ => {}
  });

  setup_traymenu(app.handle());

  let handle = window.clone();
  window.listen("tauri://drag-drop", move |ev| {
    let path: Value = serde_json::from_str(ev.payload()).unwrap();
    let path = path["paths"][0].as_str().unwrap();

    let file = File::open(&path).unwrap();
    let mut decoder = GzDecoder::new(file);
    let mut string = String::new();

    decoder.read_to_string(&mut string).unwrap();

    let mut map = Map::new();

    map.insert("path".to_owned(), Value::String(path.to_owned()));
    map.insert("graph".to_owned(), Value::String(string));

    handle.emit("load_new_tab", Value::Object(map)).unwrap();
  });

  let (sender, receiver) = bounded(1024);

  tokio::spawn(async move {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  let (runtime_sender, runtime_receiver) = bounded(1024);

  let runtime_sender_1 = runtime_sender.clone();
  tokio::spawn(async move {
    loop {
      let cmd = runtime_command_receiver.recv().unwrap();
      runtime_sender_1.send(cmd).unwrap();
    }
  });

  tokio::spawn(async move {
    loop {
      let message = receiver.recv().unwrap();

      window.emit("osc-message", &message).unwrap();

      let msg = message.clone();
      let mut addrs = addresses.lock().unwrap();
      if !addrs.contains(&msg) {
        addrs.push(msg);
      }

      runtime_sender
        .send(RuntimeCommand::OSCMessage(message))
        .unwrap();
    }
  });

  tokio::spawn(async move {
    let mut tabs: HashMap<String, RuntimeNodeTree> = HashMap::new();

    loop {
      let cmd = runtime_receiver.recv().unwrap();

      match cmd {
        RuntimeCommand::OSCMessage(msg) => {
          for (_, mut tab) in &mut tabs {
            let keys: Vec<String> = tab.nodes.keys().map(|x| x.clone()).collect();

            for id in keys.clone() {
              let entry = tab.nodes[&id].is_entrypoint();

              if entry {
                let args = vec![
                  vec![ParameterType::String(msg.address.clone())],
                  msg.values.clone(),
                ]
                .concat();

                runtime_dry(id.clone(), &args, &mut tab).unwrap();
              }
            }

            for id in keys {
              let entry = tab.nodes[&id].is_entrypoint();

              if entry {
                let _ = runtime(id.clone(), &mut tab);
              }
            }
          }
        }

        RuntimeCommand::AddTab(graph, id) => {
          tabs.insert(id, RuntimeNodeTree::from(graph));
        }
        RuntimeCommand::RemoveTab(id) => {
          tabs.remove(&id);
        }
      }
    }
  });
}
