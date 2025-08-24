use std::{ collections::HashMap, fs, path::PathBuf, sync::Mutex };

use serde::{ Deserialize, Serialize };
use serde_json::Value;

#[derive(Clone, Deserialize, Serialize)]
pub enum ConfigValue{
  Bool(bool),
  String(String),
  Number(f64),
  Null
}

pub struct Config{
  store: Mutex<HashMap<String, ConfigValue>>,
}

impl Config{
  pub fn new( path: PathBuf ) -> Self{
    let json_string = fs::read_to_string(path).unwrap();
    let json: Value = serde_json::from_str(&json_string).unwrap();

    let mut hashmap = HashMap::new();

    let obj = json.as_object().unwrap();
    for ( key, val ) in obj{
      hashmap.insert(key.clone(), if val.is_boolean(){ ConfigValue::Bool(val.as_bool().unwrap()) } else if val.is_number(){ ConfigValue::Number(val.as_f64().unwrap()) } else if val.is_string(){ ConfigValue::String(val.as_str().unwrap().to_owned()) } else { ConfigValue::Null });
    }

    Config {
      store: Mutex::new(hashmap),
    }
  }

  pub fn set( &self, key: &str, value: ConfigValue ){
    self.store.lock().unwrap().insert(key.to_owned(), value);
  }

  pub fn get( &self, key: &str ) -> Option<ConfigValue>{
    let store = self.store.lock().unwrap();
    let val = store.get(&key.to_owned());

    if val.is_none(){
      None
    } else{
      Some(val.unwrap().clone())
    }
  }

  pub fn save( &self ){
    let dat = serde_json::to_string(&self.store.lock().unwrap().clone()).unwrap();
    fs::write(dirs::config_dir().unwrap().join("VRCMacros").join("VRCMacros.json"), dat).unwrap();
  }
}