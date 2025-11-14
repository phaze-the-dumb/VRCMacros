use tauri::{
  menu::{MenuBuilder, MenuItemBuilder},
  tray::TrayIconBuilder,
  AppHandle, Emitter, Manager,
};

pub fn setup_traymenu(handle: &AppHandle) {
  // Setup the tray icon and menu buttons
  let quit = MenuItemBuilder::new("Quit")
    .id("quit")
    .build(handle)
    .unwrap();

  let hide = MenuItemBuilder::new("Hide / Show Editor")
    .id("hide")
    .build(handle)
    .unwrap();

  let tray_menu = MenuBuilder::new(handle)
    .items(&[&quit, &hide])
    .build()
    .unwrap();

  TrayIconBuilder::with_id("main")
    .icon(tauri::image::Image::from_bytes(include_bytes!("../../icons/32x32.png")).unwrap())
    .menu(&tray_menu)
    .title("VRCMacros")
    .tooltip("VRCMacros")
    .on_menu_event(move |app: &AppHandle, event| match event.id().as_ref() {
      "quit" => {
        app.emit("prompt_to_close", ()).unwrap();
      }
      "hide" => {
        let window = app.get_webview_window("main").unwrap();

        if window.is_visible().unwrap() {
          window.hide().unwrap();

          window.emit("hide-window", ()).unwrap();
        } else {
          window.show().unwrap();
          window.set_focus().unwrap();

          window.emit("show-window", ()).unwrap();
        }
      }
      _ => {}
    })
    .build(handle)
    .unwrap();
}
