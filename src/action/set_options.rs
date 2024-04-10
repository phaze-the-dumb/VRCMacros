use crate::{ VRCMType, VRCMValue };
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct SetOptions{
  pub variable: i64,
  pub value: VRCMValue
}

impl SetOptions{
  pub fn new( action_data: &Value ) -> Self {
    SetOptions {
      variable: action_data["variable"].as_i64().unwrap(),
      value: VRCMValue::from_value(&action_data["value"])
    }
  }

  pub fn execute( self, variable_vals: &mut Vec<VRCMValue>, def_ref: VRCMValue ){
    match self.value.val_type {
      VRCMType::Reference => {
        if self.value.reference == Some(-1){
          variable_vals[self.variable as usize] = def_ref;
        } else{
          let target_var = variable_vals[self.value.reference.unwrap() as usize].clone();
          variable_vals[self.variable as usize] = target_var;
        }
      },
      _ => { variable_vals[self.variable as usize] = self.value; }
    }
  }
}