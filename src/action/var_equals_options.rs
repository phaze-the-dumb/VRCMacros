use crate::VRCMValue;
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct VarEqualsOptions{
  pub variable: i64,
  pub value: VRCMValue
}

impl VarEqualsOptions{
  pub fn new( action_data: &Value ) -> Self {
    VarEqualsOptions {
      variable: action_data["variable"].as_i64().unwrap(),
      value: VRCMValue::from_value(&action_data["value"])
    }
  }

  pub fn execute( self, variable_vals: &mut Vec<VRCMValue>, def_val: VRCMValue ) -> bool {
    if self.variable == -1 {
      def_val == self.value
    } else{
      let variable = variable_vals[self.variable as usize].clone();

      variable == self.value
    }
  }
}