use serde_json::{json, Value};
use tauri::State;

use crate::utils::config::Config;

#[tauri::command]
pub fn new_trigger( id: String, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();
    triggers.push(json!({
      "id": id,
      "address": "",
      "actions": []
    }));

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn rm_trigger( indx: usize, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();
    triggers.remove(indx);

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn add_trigger_action( indx: usize, action: Value, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();

    let actions = triggers[indx]["actions"].as_array_mut().unwrap();
    actions.push(action);

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn rm_trigger_action( indx: usize, action_indx: usize, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();

    let actions = triggers[indx]["actions"].as_array_mut().unwrap();
    actions.remove(action_indx);

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn set_trigger_action_type( indx: usize, action_indx: usize, action_type: Option<String>, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();

    triggers[indx]["actions"][action_indx]["actionType"] = if action_type.is_none(){
      Value::Null
    } else {
      Value::String(action_type.unwrap())
    };

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn set_trigger_address( indx: usize, address: String, conf: State<Config> ){
  if let Some(triggers) = conf.get("triggers").unwrap_or(Value::Array(Vec::new())).as_array(){
    let mut triggers = triggers.clone();
    triggers[indx]["address"] = Value::String(address);

    conf.set("triggers", Value::Array(triggers));
    conf.save();
  }
}

#[tauri::command]
pub fn list_triggers( conf: State<Config> ) -> Value{
  conf.get("triggers").unwrap_or(Value::Array(Vec::new()))
}