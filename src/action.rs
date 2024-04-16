mod set_options;
mod var_equals_options;
mod send_chatbox_options;
mod join_string_options;
mod press_key_options;
mod voicemeeter_options;
mod osc_options;

use serde_json::Value;

use set_options::SetOptions;
use var_equals_options::VarEqualsOptions;
use send_chatbox_options::SendChatboxOptions;
use join_string_options::JoinStringOptions;
use voicemeeter_options::VoiceMeeterOptions;
use press_key_options::PressKeyOptions;
use osc_options::OSCOptions;

#[derive(Debug,Clone)]
pub enum ActionType{
  Unknown,
  Set,
  VarEquals,
  SendChatbox,
  JoinString,
  PressKey,
  VoiceMeeter,
  OSCSend
}

#[derive(Debug,Clone)]
pub struct Action {
  pub action_type: ActionType,

  pub set_options: Option<SetOptions>,
  pub var_equals_options: Option<VarEqualsOptions>,
  pub send_chatbox_options: Option<SendChatboxOptions>,
  pub join_string_options: Option<JoinStringOptions>,
  pub press_key_options: Option<PressKeyOptions>,
  pub voicemeeter_options: Option<VoiceMeeterOptions>,
  pub osc_options: Option<OSCOptions>,

  pub then: Vec<Action>,
  pub then_else: Vec<Action>,
}

impl Action{
  pub fn new( action_data: &Value ) -> Action {
    let mut action = Action {
      action_type: match action_data["type"].as_str().unwrap() {
        "set" => ActionType::Set,
        "var_equals" => ActionType::VarEquals,
        "send_chatbox" => ActionType::SendChatbox,
        "join_string" => ActionType::JoinString,
        "press_key" => ActionType::PressKey,
        "voicemeeter" => ActionType::VoiceMeeter,
        "send_osc" => ActionType::OSCSend,
        _ => ActionType::Unknown
      },

      then: Vec::new(),
      then_else: Vec::new(),

      set_options: None,
      var_equals_options: None,
      send_chatbox_options: None,
      join_string_options: None,
      press_key_options: None,
      voicemeeter_options: None,
      osc_options: None
    };

    match action.action_type{
      ActionType::Set => {
        action.set_options = Some(SetOptions::new(action_data));
      }
      ActionType::JoinString => {
        action.join_string_options = Some(JoinStringOptions::new(action_data));
      }
      ActionType::SendChatbox => {
        action.send_chatbox_options = Some(SendChatboxOptions::new(action_data));
      }
      ActionType::VarEquals => {
        action.var_equals_options = Some(VarEqualsOptions::new(action_data));
      }
      ActionType::PressKey => {
        action.press_key_options = Some(PressKeyOptions::new(action_data));
      }
      ActionType::VoiceMeeter => {
        action.voicemeeter_options = Some(VoiceMeeterOptions::new(action_data));
      }
      ActionType::OSCSend => {
        action.osc_options = Some(OSCOptions::new(action_data));
      }
      _ => {}
    }

    if !action_data["then"].is_null() {
      let actions = action_data["then"].as_array().unwrap();

      for a in actions {
        action.then.push(Action::new(a));
      };
    }

    if !action_data["then_else"].is_null() {
      let actions_else = action_data["then_else"].as_array().unwrap();

      for a in actions_else {
        action.then_else.push(Action::new(a));
      };
    }

    action
  }
}