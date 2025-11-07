use std::{ collections::HashMap, fs::File, io::{ Read, Write }, path::PathBuf, sync::Mutex };

use flate2::{ read::GzDecoder, write::GzEncoder, Compression };
use serde::{ Deserialize, Serialize };

use crate::structs::nodes::Node;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ConfigValues{
  #[serde(default)]
  pub loaded_tabs: HashMap<String, Vec<Node>>
}

pub struct Config {
  pub store: Mutex<ConfigValues>,
  path: PathBuf,
}

impl Config {
  pub fn new(path: PathBuf) -> Self {
    let json_string = if path.exists() {
      let mut decoder = GzDecoder::new(File::open(&path).unwrap());
      let mut string = String::new();

      decoder.read_to_string(&mut string).unwrap();
      string
    } else {
      "{}".into()
    };

    let json: ConfigValues = serde_json::from_str(&json_string).unwrap();

    Config {
      store: Mutex::new(json),
      path: path,
    }
  }

  pub fn save(&self) {
    let dat = serde_json::to_string(&self.store.lock().unwrap().clone()).unwrap();
    dbg!(&dat);

    let file = File::create(&self.path).unwrap();
    let mut encoder = GzEncoder::new(file, Compression::default());

    encoder.write_all(dat.as_bytes()).unwrap();
    encoder.finish().unwrap();
  }
}
