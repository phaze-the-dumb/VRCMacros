use crate::structs::action::{ Action, ActionParameters };

#[tauri::command]
pub fn get_actions() -> Vec<Action> {
  vec![
    Action {
      name: "If Equals".into(),
      parameters: vec![ ActionParameters::AnyType, ActionParameters::Label(" = "), ActionParameters::AnyType ]
    }
  ]
}

#[tauri::command]
pub fn get_action( name: String ) -> Option<Action> {
  let actions = vec![
    Action {
      name: "If Equals".into(),
      parameters: vec![ ActionParameters::AnyType, ActionParameters::Label(" = "), ActionParameters::AnyType ]
    }
  ];

  let action = actions.iter().find(| x | x.name == name);

  if action.is_some(){
    Some(action.unwrap().clone())
  } else{
    None
  }
}