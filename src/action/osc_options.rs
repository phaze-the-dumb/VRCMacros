use crate::{ osc::{ self, OSCValue, OSCTypeTag }, VRCMType, VRCMValue };
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct OSCOptions{
  pub address: VRCMValue,
  pub value: VRCMValue,
  pub ip: VRCMValue,
}

impl OSCOptions{
  pub fn new( action_data: &Value ) -> Self {
    OSCOptions {
      address: VRCMValue::from_value(&action_data["address"]),
      value: VRCMValue::from_value(&action_data["value"]),
      ip: VRCMValue::from_value(&action_data["ip"]),
    }
  }

  pub fn execute( self, variable_vals: &mut Vec<VRCMValue>, def_ref: VRCMValue ) {
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

    match value.val_type{
      VRCMType::Bool => {
        if value.bool.unwrap(){
          osc::send_message_string(self.address.string.unwrap().as_str(), [ OSCValue { osc_type: OSCTypeTag::TRUE, int: None, float: None, string: None } ].to_vec(), self.ip.string.unwrap().as_str());
        } else{
          osc::send_message_string(self.address.string.unwrap().as_str(), [ OSCValue { osc_type: OSCTypeTag::FALSE, int: None, float: None, string: None } ].to_vec(), self.ip.string.unwrap().as_str());
        }
      },
      VRCMType::Number => {
        osc::send_message_string(self.address.string.unwrap().as_str(), [ OSCValue { osc_type: OSCTypeTag::FLOAT, int: None, float: Some(value.number.unwrap() as f32), string: None } ].to_vec(), self.ip.string.unwrap().as_str());
      },
      VRCMType::String => {
        osc::send_message_string(self.address.string.unwrap().as_str(), [ OSCValue { osc_type: OSCTypeTag::STRING, int: None, float: None, string: Some(value.string.unwrap()) } ].to_vec(), self.ip.string.unwrap().as_str());
      },
      _ => {}
    }

  }
}