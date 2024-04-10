use crate::{ VRCMValue, VRCMType };
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct JoinStringOptions{
  pub first_string: VRCMValue,
  pub last_string: VRCMValue,
}

impl JoinStringOptions{
  pub fn new( action_data: &Value ) -> Self {
    JoinStringOptions {
      first_string: VRCMValue::from_value(&action_data["first_string"]),
      last_string: VRCMValue::from_value(&action_data["last_string"]),
    }
  }

  pub fn execute( self, variable_vals: &mut Vec<VRCMValue>, def_ref: VRCMValue ) -> VRCMValue {
    let first_string: String;
    let last_string: String;

    match self.first_string.val_type {
      VRCMType::Reference => {
        if self.first_string.reference == Some(-1){
         first_string = def_ref.clone().string.unwrap();
        } else{
          let target_var = variable_vals[self.first_string.reference.unwrap() as usize].clone();
          first_string = target_var.string.unwrap();
        }
      },
      _ => { first_string = self.first_string.string.unwrap(); }
    };

    match self.last_string.val_type {
      VRCMType::Reference => {
        if self.last_string.reference == Some(-1){
         last_string = def_ref.clone().string.unwrap();
        } else{
          let target_var = variable_vals[self.last_string.reference.unwrap() as usize].clone();
          last_string = target_var.string.unwrap();
        }
      },
      _ => { last_string = self.last_string.string.unwrap(); }
    };

    VRCMValue{
      bool: None,
      number: None,
      reference: None,
      string: Some(first_string + &last_string),
      val_type: VRCMType::String
    }
  }
}