use crate::action::Action;
use serde_json::Value;

#[derive(Debug,Clone)]
pub struct EventGroup {
  pub event: String,
  pub actions: Vec<Action>
}

impl EventGroup {
  pub fn new( event: String, actions: &Value ) -> EventGroup {
    let mut a = EventGroup {
      event: event,
      actions: Vec::new()
    };

    let actions = actions.as_array().unwrap();

    for action in actions {
      a.actions.push(Action::new(action));
    }

    a
  }
}