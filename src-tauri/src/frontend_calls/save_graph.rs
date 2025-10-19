use std::{ fs::File, io::Write };

use flate2::{ write::GzEncoder, Compression };

#[tauri::command]
pub fn save_graph( tab_name: String, graph: String ) {
  dbg!(&graph);

  let path = dirs::config_dir().unwrap().join("VRCMacros").join(format!("{}.macro", tab_name));

  let file = File::create(&path).unwrap();
  let mut encoder = GzEncoder::new(file, Compression::default());

  encoder.write_all(graph.as_bytes()).unwrap();
  encoder.finish().unwrap();
}