use crate::{ VRCMValue, VRCMType, osc::{ self, OSCTypeTag, OSCValue } };
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct SendChatboxOptions{
  pub value: VRCMValue
}

impl SendChatboxOptions{
  pub fn new( action_data: &Value ) -> Self {
    SendChatboxOptions {
      value: VRCMValue::from_value(&action_data["value"])
    }
  }

  pub fn execute( self, variable_vals: &mut Vec<VRCMValue>, def_ref: VRCMValue ){
    let value = match self.value.val_type {
      VRCMType::Reference => {
        if self.value.reference == Some(-1){
          def_ref
        } else{
          let target_var = variable_vals[self.value.reference.unwrap() as usize].clone();
          target_var
        }
      },
      _ => self.value
    };

    osc::send_message_string("/chatbox/input", [
      OSCValue { string: Some(value.string.unwrap()), float: None, int: None, osc_type: OSCTypeTag::STRING },
      OSCValue { string: None, float: None, int: None, osc_type: OSCTypeTag::TRUE },
      OSCValue { string: None, float: None, int: None, osc_type: OSCTypeTag::FALSE },
    ].to_vec(), "127.0.0.1:9000");
  }
}