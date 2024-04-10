mod osc;
mod action;
mod action_group;
mod event_group;

use std::{ fs, sync, thread, time::{ SystemTime, Duration } };
use action::{ Action, ActionType };
use osc::{ OSCTypeTag, OSCValue };
use serde_json::Value;
use action_group::ActionGroup;
use event_group::EventGroup;
use windows::Media::Control::GlobalSystemMediaTransportControlsSessionManager;

#[derive(Debug, Clone, PartialEq)]
enum VRCMType{
  Number,
  String,
  Bool,
  Reference,
  Unknown
}

#[derive(Debug, Clone, PartialEq)]
struct VRCMValue{
  number: Option<f64>,
  string: Option<String>,
  bool: Option<bool>,
  reference: Option<i64>,
  val_type: VRCMType
}

impl VRCMValue{
  fn from_osc_value( val: &OSCValue ) -> VRCMValue {
    match val.osc_type {
      OSCTypeTag::TRUE => {
        VRCMValue {
          bool: Some(true),
          number: None,
          string: None,
          reference: None,
          val_type: VRCMType::Bool
        }
      }
      OSCTypeTag::FALSE => {
        VRCMValue {
          bool: Some(false),
          number: None,
          string: None,
          reference: None,
          val_type: VRCMType::Bool
        }
      }
      OSCTypeTag::INTEGER  => {
        VRCMValue {
          bool: None,
          number: Some(val.int.unwrap() as f64),
          string: None,
          reference: None,
          val_type: VRCMType::Number
        }
      }
      OSCTypeTag::FLOAT  => {
        VRCMValue {
          bool: None,
          number: Some(val.float.unwrap() as f64),
          string: None,
          reference: None,
          val_type: VRCMType::Bool
        }
      }
      OSCTypeTag::STRING => {
        VRCMValue {
          bool: None,
          number: None,
          string: val.string.clone(),
          reference: None,
          val_type: VRCMType::String
        }
      }
    }
  }

  fn from_value( val: &Value ) -> VRCMValue{
    if val.is_number() {
      VRCMValue {
        bool: None,
        number: val.as_f64(),
        string: None,
        reference: None,
        val_type: VRCMType::Number
      }
    } else if val.is_boolean() {
      VRCMValue {
        bool: val.as_bool(),
        number: None,
        string: None,
        reference: None,
        val_type: VRCMType::Bool
      }
    } else if val.is_number() {
      VRCMValue {
        bool: None,
        number: val.as_f64(),
        string: None,
        reference: None,
        val_type: VRCMType::Number
      }
    } else if val.is_string() {
      let string = val.as_str().unwrap();

      if string.starts_with("data_val:") {
        VRCMValue {
          bool: None,
          number: None,
          reference: Some(string.split("data_val:").last().unwrap().parse().expect("Found a Reference value that doesn't have a valid address")),
          string: None,
          val_type: VRCMType::Reference
        }
      } else{
        VRCMValue {
          bool: None,
          number: None,
          reference: None,
          string: Some(String::from(string)),
          val_type: VRCMType::String
        }
      }
    } else{
      VRCMValue {
        bool: None,
        number: None,
        string: None,
        reference: None,
        val_type: VRCMType::Unknown
      }
    }
  }
}

#[tokio::main]
async fn main(){
  let ( sender, receiver ) = sync::mpsc::channel();
  let macros: Value = serde_json::from_str(&fs::read_to_string("macros.json").unwrap()).unwrap();

  let mut variable_keys: Vec<&str> = Vec::new();
  let mut variable_vals: Vec<VRCMValue> = Vec::new();

  let mut current_song: String = String::from("");

  let mp = GlobalSystemMediaTransportControlsSessionManager::RequestAsync()
    .unwrap().await
    .unwrap();

  let session = mp.GetCurrentSession().unwrap();

  for key in macros["variables"].as_object().unwrap().keys() {
    variable_keys.push(key);
  }

  for val in macros["variables"].as_object().unwrap().values() {
    let value = VRCMValue::from_value(val);
    dbg!(&value);

    variable_vals.push(value);
  }

  let mut actions: Vec<ActionGroup> = Vec::new();
  let mut events: Vec<EventGroup> = Vec::new();

  for action_data in macros["actions"].as_array().unwrap() {
    actions.push(ActionGroup::new(String::from(action_data["address"].as_str().unwrap()), &action_data["actions"]));
  }

  for event_data in macros["events"].as_array().unwrap() {
    events.push(EventGroup::new(String::from(event_data["event"].as_str().unwrap()), &event_data["actions"]));
  }

  thread::spawn(move || {
    osc::start_server(sender, "127.0.0.1:9001");
  });

  let properties = session.TryGetMediaPropertiesAsync().unwrap().await.unwrap();
  let song = format!("{} - {}", properties.Title().unwrap(), properties.Artist().unwrap());

  if current_song != song {
    current_song = song;

    dbg!(&current_song);

    for event in &events {
      if event.event == "song_change" {
        process_actions(event.clone().actions, VRCMValue { number: None, string: Some(current_song.clone()), bool: None, reference: None, val_type: VRCMType::String }, &mut variable_vals);
        break;
      }
    }
  }

  let mut last_update = SystemTime::now();
  loop {
    let message = receiver.recv_timeout(Duration::from_secs(10));

    match message {
      Err(_) => {
        let properties = session.TryGetMediaPropertiesAsync().unwrap().await.unwrap();
        let song = format!("{} - {}", properties.Title().unwrap(), properties.Artist().unwrap());

        last_update = SystemTime::now();

        if current_song != song {
          current_song = song;

          dbg!(&current_song);

          for event in &events {
            if event.event == "song_change" {
              process_actions(event.clone().actions, VRCMValue { number: None, string: Some(current_song.clone()), bool: None, reference: None, val_type: VRCMType::String }, &mut variable_vals);
              break;
            }
          }
        }

        for event in &events {
          if event.event == "update" {
            process_actions(event.clone().actions, VRCMValue { number: None, string: Some(current_song.clone()), bool: None, reference: None, val_type: VRCMType::String }, &mut variable_vals);
            break;
          }
        }
      },
      Ok( message ) => {
        if last_update.elapsed().unwrap().as_secs() > 10 {
          last_update = SystemTime::now();

          let properties = session.TryGetMediaPropertiesAsync().unwrap().await.unwrap();
          let song = format!("{} - {}", properties.Title().unwrap(), properties.Artist().unwrap());

          if current_song != song {
            current_song = song;

            dbg!(&current_song);

            for event in &events {
              if event.event == "song_change" {
                process_actions(event.clone().actions, VRCMValue { number: None, string: Some(current_song.clone()), bool: None, reference: None, val_type: VRCMType::String }, &mut variable_vals);
                break;
              }
            }
          }

          for event in &events {
            if event.event == "update" {
              process_actions(event.clone().actions, VRCMValue { number: None, string: Some(current_song.clone()), bool: None, reference: None, val_type: VRCMType::String }, &mut variable_vals);
              break;
            }
          }
        }

        let mut commands: Option<ActionGroup> = None;
    
        for group in &actions {
          if group.address == message.address {
            commands = Some(group.clone());
            break;
          }
        }
    
        match commands{
          None => {},
          Some( commands ) => {
            process_actions(commands.actions, VRCMValue::from_osc_value(&message.values[0]), &mut variable_vals);
          }
        }
      }
    }
  }
}

fn process_actions( actions: Vec<Action>, def_ref: VRCMValue, variable_vals: &mut Vec<VRCMValue> ){
  for action in actions {
    match action.action_type {
      ActionType::Set => {
        let set_options = action.set_options.unwrap();
        set_options.execute(variable_vals, def_ref.clone());
      }
      ActionType::JoinString => {
        let join_string_options = action.join_string_options.unwrap();
        let joined_string = join_string_options.execute(variable_vals, def_ref.clone());

        process_actions(action.then, joined_string, variable_vals);
      }
      ActionType::VarEquals => {
        let var_equals_options = action.var_equals_options.unwrap();
        let is_equal = var_equals_options.execute(variable_vals, def_ref.clone());

        if is_equal {
          process_actions(action.then, def_ref.clone(), variable_vals);
        } else{
          process_actions(action.then_else, def_ref.clone(), variable_vals);
        }
      }
      ActionType::SendChatbox => {
        let send_chatbox_options = action.send_chatbox_options.unwrap();
        send_chatbox_options.execute(variable_vals, def_ref.clone());
      }
      ActionType::PressKey => {
        let press_key_options = action.press_key_options.unwrap();
        press_key_options.execute(def_ref.clone(), variable_vals);
      }
      ActionType::VoiceMeeter => {
        let voicemeeter_options = action.voicemeeter_options.unwrap();
        voicemeeter_options.execute(variable_vals, def_ref.clone());
      }
      _ => {}
    }
  }
}