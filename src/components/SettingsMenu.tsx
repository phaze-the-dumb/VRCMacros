import { invoke } from '@tauri-apps/api/core';
import './SettingsMenu.css';

export interface SettingsMenuProps{
  close: () => void
}

export let SettingsMenu = ( props: SettingsMenuProps ) => {
  // TODO: Changable OSC Ports
  // TODO: Changable keybinds

  return (
    <>
      <div class="settings-menu">
        <div class="settings-menu-inner">
          <div class="settings-menu-header">
            <h1 style={{ float: 'left' }}>Options</h1>
            <div style={{ float: 'right' }} class="settings-menu-close">
              <div style={{ background: 'red', width: '25px', height: '25px', cursor: 'pointer' }} onClick={() => props.close()}></div>
            </div>
          </div>

          <div class="settings-menu-content">
            Hide editor on app start:
            <input
              ref={async ( el ) => el.checked = await invoke('get_hide_editor_on_app_start')}
              onChange={( el ) => invoke('set_hide_editor_on_app_start', { value: el.target.checked })}
              type="checkbox"
              style={{ width: '15px', height: '15px' }} />
          </div>
        </div>
      </div>
    </>
  )
}