use crate::{ VRCMValue, VRCMType };
use voicemeeter::VoicemeeterRemote;
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct VoiceMeeterOptions{
  pub strip: i32,
  pub value: VRCMValue,
  pub property: String,

  vm_remote: VoicemeeterRemote
}

impl VoiceMeeterOptions{
  pub fn new( action_data: &Value ) -> Self {
    VoiceMeeterOptions {
      strip: action_data["strip"].as_i64().unwrap() as i32,
      value: VRCMValue::from_value(&action_data["value"]),
      property: String::from(action_data["property"].as_str().unwrap()),
      vm_remote: VoicemeeterRemote::new().unwrap()
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

    match self.property.as_str() {
      "A1" => { self.vm_remote.parameters().strip(self.strip).unwrap().a1().set(value.bool.unwrap()).unwrap(); }
      "A2" => { self.vm_remote.parameters().strip(self.strip).unwrap().a2().set(value.bool.unwrap()).unwrap(); }
      "A3" => { self.vm_remote.parameters().strip(self.strip).unwrap().a3().set(value.bool.unwrap()).unwrap(); }
      "A4" => { self.vm_remote.parameters().strip(self.strip).unwrap().a4().set(value.bool.unwrap()).unwrap(); }
      "A5" => { self.vm_remote.parameters().strip(self.strip).unwrap().a5().set(value.bool.unwrap()).unwrap(); }
      "B1" => { self.vm_remote.parameters().strip(self.strip).unwrap().b1().set(value.bool.unwrap()).unwrap(); }
      "B2" => { self.vm_remote.parameters().strip(self.strip).unwrap().b2().set(value.bool.unwrap()).unwrap(); }
      "B3" => { self.vm_remote.parameters().strip(self.strip).unwrap().b3().set(value.bool.unwrap()).unwrap(); }

      "Gain" => { self.vm_remote.parameters().strip(self.strip).unwrap().gain().set((value.number.unwrap() as f32) * 72.0 - 60.0).unwrap(); }
      "Mute" => { self.vm_remote.parameters().strip(self.strip).unwrap().mute().set(value.bool.unwrap()).unwrap(); }

      _ => {}
    };
  }
}