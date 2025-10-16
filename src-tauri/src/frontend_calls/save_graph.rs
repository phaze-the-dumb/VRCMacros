use std::{ fs::File, io::Write };

use flate2::{ write::GzEncoder, Compression };

#[tauri::command]
pub fn save_graph( graph: String ) {
  dbg!(&graph);

  let path = dirs::config_dir().unwrap().join("VRCMacros").join("graph");

  let file = File::create(&path).unwrap();
  let mut encoder = GzEncoder::new(file, Compression::default());

  encoder.write_all(graph.as_bytes()).unwrap();
  encoder.finish().unwrap();
}