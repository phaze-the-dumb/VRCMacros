use std::{
  collections::HashMap,
  fs::File,
  io::{Read, Write},
  path::PathBuf,
  sync::Mutex,
};

use flate2::{read::GzDecoder, write::GzEncoder, Compression};
use serde_json::Value;

pub struct Config {
  store: Mutex<HashMap<String, Value>>,
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

    let json: Value = serde_json::from_str(&json_string).unwrap();

    let mut hashmap = HashMap::new();

    let obj = json.as_object().unwrap();
    for (key, val) in obj {
      hashmap.insert(key.clone(), val.clone());
    }

    Config {
      store: Mutex::new(hashmap),
      path: path,
    }
  }

  pub fn set(&self, key: &str, value: Value) {
    self.store.lock().unwrap().insert(key.to_owned(), value);
  }

  pub fn get(&self, key: &str) -> Option<Value> {
    let store = self.store.lock().unwrap();
    let val = store.get(&key.to_owned());

    if val.is_none() {
      None
    } else {
      Some(val.unwrap().clone())
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
