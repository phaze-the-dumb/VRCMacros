use crate::{ VRCMType, VRCMValue };
use serde_json::Value;
use enigo::*;

#[derive(Debug,Clone)]
pub struct PressKeyOptions{
  pub key: VRCMValue
}

impl PressKeyOptions{
  pub fn new( action_data: &Value ) -> Self {
    PressKeyOptions {
      key: VRCMValue::from_value(&action_data["key"])
    }
  }

  pub fn execute( self, def_ref: VRCMValue, variable_vals: &mut Vec<VRCMValue> ){
    let mut enigo = Enigo::new();

    let key = match self.key.val_type {
      VRCMType::Reference => {
        if self.key.reference == Some(-1){
          def_ref
        } else{
          let target_var = variable_vals[self.key.reference.unwrap() as usize].clone();
          target_var
        }
      },
      _ => { self.key }
    };

    // I hate this so much, i am so sorry
    match key.string.unwrap().as_str() {
      "F1" => { enigo.key_click(Key::F1) }
      "F2" => { enigo.key_click(Key::F2) }
      "F3" => { enigo.key_click(Key::F3) }
      "F4" => { enigo.key_click(Key::F4) }
      "F5" => { enigo.key_click(Key::F5) }
      "F6" => { enigo.key_click(Key::F6) }
      "F7" => { enigo.key_click(Key::F7) }
      "F8" => { enigo.key_click(Key::F8) }
      "F9" => { enigo.key_click(Key::F9) }
      "F10" => { enigo.key_click(Key::F10) }
      "F11" => { enigo.key_click(Key::F11) }
      "F12" => { enigo.key_click(Key::F12) }

      "A" => { enigo.key_click(Key::A) }
      "B" => { enigo.key_click(Key::B) }
      "C" => { enigo.key_click(Key::C) }
      "D" => { enigo.key_click(Key::D) }
      "E" => { enigo.key_click(Key::E) }
      "F" => { enigo.key_click(Key::F) }
      "G" => { enigo.key_click(Key::G) }
      "H" => { enigo.key_click(Key::H) }
      "I" => { enigo.key_click(Key::I) }
      "J" => { enigo.key_click(Key::J) }
      "K" => { enigo.key_click(Key::K) }
      "L" => { enigo.key_click(Key::L) }
      "M" => { enigo.key_click(Key::M) }
      "N" => { enigo.key_click(Key::N) }
      "O" => { enigo.key_click(Key::O) }
      "P" => { enigo.key_click(Key::H) }
      "Q" => { enigo.key_click(Key::I) }
      "R" => { enigo.key_click(Key::J) }
      "S" => { enigo.key_click(Key::K) }
      "T" => { enigo.key_click(Key::L) }
      "U" => { enigo.key_click(Key::M) }
      "V" => { enigo.key_click(Key::N) }
      "W" => { enigo.key_click(Key::O) }
      "X" => { enigo.key_click(Key::X) }
      "Y" => { enigo.key_click(Key::Y) }
      "Z" => { enigo.key_click(Key::Z) }

      "0" => { enigo.key_click(Key::Num0) }
      "1" => { enigo.key_click(Key::Num1) }
      "2" => { enigo.key_click(Key::Num2) }
      "3" => { enigo.key_click(Key::Num3) }
      "4" => { enigo.key_click(Key::Num4) }
      "5" => { enigo.key_click(Key::Num5) }
      "6" => { enigo.key_click(Key::Num6) }
      "7" => { enigo.key_click(Key::Num7) }
      "8" => { enigo.key_click(Key::Num8) }
      "9" => { enigo.key_click(Key::Num9) }

      "media_prev" => { enigo.key_click(Key::MediaPrevTrack) }
      "media_play_pause" => { enigo.key_click(Key::MediaPlayPause) }
      "media_next" => { enigo.key_click(Key::MediaNextTrack) }

      _ => {}
    };
  }
}