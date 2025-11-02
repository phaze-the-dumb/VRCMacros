use std::{ collections::HashMap, fs::File, io::Read, sync::{ self, mpsc::Receiver, Mutex } };

use flate2::read::GzDecoder;
use serde_json::{ Map, Value };
use tauri::{ App, Emitter, Listener, Manager };

use crate::{ osc::{ self, OSCMessage }, runtime::{ commands::RuntimeCommand, nodes::RuntimeNodeTree, runtime, runtime_dry }, structs::parameter_types::ParameterType };

pub fn setup(
  app: &mut App,
  addresses: &'static Mutex<Vec<OSCMessage>>,
  runtime_command_receiver: Receiver<RuntimeCommand>
) {
  let window = app.get_webview_window("main").unwrap();

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

  let ( sender, receiver ) = sync::mpsc::channel();

  tokio::spawn(async move {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  let ( runtime_sender, runtime_receiver ) = sync::mpsc::channel();

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
      let mut addresses = addresses.lock().unwrap();
      if !addresses.contains(&msg) { addresses.push(msg); }

      runtime_sender.send(RuntimeCommand::OSCMessage(message)).unwrap();
    }
  });

  tokio::spawn(async move {
    let mut tabs: HashMap<String, RuntimeNodeTree> = HashMap::new();

    loop {
      let cmd = runtime_receiver.recv().unwrap();

      match cmd{
        RuntimeCommand::OSCMessage( msg ) => {
          for ( _, tab ) in &mut tabs{
            for ( id, node ) in &tab.nodes{
              let node = node.lock().unwrap();

              if node.is_entrypoint(){
                let args = vec![
                  vec![ ParameterType::String(msg.address.clone()) ], msg.values.clone()
                ].concat();

                drop(node);
                // ^^ Drop this MutexGuard before we enter the runtime,
                //    as it blocks the runtime for gaining a lock on the node
                //    TODO: Please find a better way of making it mutable

                runtime_dry(id.clone(), &args, tab).unwrap();
              }
            }

            for ( id, node ) in &tab.nodes{
              let node = node.lock().unwrap();

              if node.is_entrypoint(){
                drop(node);
                // ^^ Drop this MutexGuard before we enter the runtime,
                //    as it blocks the runtime for gaining a lock on the node
                //    TODO: Please find a better way of making it mutable

                runtime(id.clone(), tab).unwrap();
              }
            }
          }
        },

        RuntimeCommand::AddTab( graph, id ) => {
          tabs.insert(id, RuntimeNodeTree::from(graph));
        },
        RuntimeCommand::RemoveTab( id ) => {
          tabs.remove(&id);
        }
      }
    }
  });
}
