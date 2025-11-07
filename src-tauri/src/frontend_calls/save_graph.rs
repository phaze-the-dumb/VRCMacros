use std::{fs::File, io::Write, path::PathBuf};

use flate2::{ write::GzEncoder, Compression };
use tauri::State;

use crate::utils::config::Config;

#[tauri::command]
pub fn save_graph( graph: String, path: PathBuf, conf: State<Config> ) {
  let file = File::create(&path).unwrap();
  let mut encoder = GzEncoder::new(file, Compression::default());

  encoder.write_all(graph.as_bytes()).unwrap();
  encoder.finish().unwrap();

  conf.save();
}
