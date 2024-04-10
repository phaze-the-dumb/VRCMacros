use crate::action::Action;
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct ActionGroup {
  pub address: String,
  pub actions: Vec<Action>
}

impl ActionGroup {
  pub fn new( address: String, actions: &Value ) -> ActionGroup {
    let mut a = ActionGroup {
      address: address,
      actions: Vec::new()
    };

    let actions = actions.as_array().unwrap();

    for action in actions {
      a.actions.push(Action::new(action));
    }

    a
  }
}