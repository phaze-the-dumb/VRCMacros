import './TabMenu.css';

import { createSignal, For, onMount, Show } from 'solid-js';
import { NodeManager } from '../Mangers/NodeManager';
import { Tab } from '../structs/Tab';
import { SettingsMenu } from './SettingsMenu';

export let TabMenu = () => {
  let [ tabImportOpen, setTabImportOpen ] = createSignal(false);
  let [ tabs, setTabs ] = createSignal<Tab[]>([], { equals: false });

  let [ settingsOpen, setSettingsOpen ] = createSignal(false);

  let closeTabImportMenu = () => {
    window.removeEventListener('click', closeTabImportMenu);
    setTabImportOpen(false);
  }

  onMount(() => {
    NodeManager.Instance.HookTabUpdate(setTabs);
  });

  return (
    <>
      <Show when={settingsOpen()}>
        <SettingsMenu close={() => setSettingsOpen(false)} />
      </Show>
      
      <div class="tab-menu">
        <div class="tab-container">
          <For each={Object.values(tabs())}>
            {
              tab =>
              <div class={ tab.selected() ? 'tab-selected ' : 'tab' } onClick={() => {
                NodeManager.Instance.SelectTab(tab.id);
              }}>
                <div class="tab-icon" onClick={async () => {
                  if(tab.selected()){
                    NodeManager.Instance.SaveTab(tab);
                  }
                }}>
                  <Show when={tab.selected() && tab.needsSave()} fallback={
                    <img src="/assets/icons/pen-to-square-regular-full.svg" width="15" />
                  }>
                    <img src="/assets/icons/floppy-disk-solid-full.svg" width="15" />
                  </Show>

                </div>
                <div class="tab-meta" onDblClick={( e ) => {
                  let input = <input class="tab-meta-input" value={ e.target.innerHTML } /> as HTMLInputElement;

                  e.target.innerHTML = '';
                  e.target.appendChild(input);

                  input.select();
                  input.onchange = () => {
                    NodeManager.Instance.RenameTab(tab.id, input.value);
                    e.target.innerHTML = input.value;
                  }
                }}>{ tab.name }</div>
                <div class="tab-close" onClick={() => {
                  setTimeout(() => {
                    NodeManager.Instance.CloseTab(tab.id);
                  }, 50)
                }}><img src="/assets/icons/xmark-solid-full.svg" width="12" /></div>
              </div>
            }
          </For>

          <div class="tab" onClick={() => {
            NodeManager.Instance.AddTab("Untitled");
          }} onContextMenu={( e ) => {
              e.preventDefault();
              setTabImportOpen(true);

              window.addEventListener('click', closeTabImportMenu);
            }}>
            <div class="tab-new-dropdown" style={{ display: tabImportOpen() ? 'block' : 'none' }}>
              <div class="tab">Import from file</div>
              <div class="tab">Import from URL</div>
            </div>
            <div class="tab-icon"><img src="/assets/icons/plus-solid-full.svg" width="15" /></div>
            <div class="tab-meta">New Tab</div>
          </div>
        </div>

        <div class="tab-icon-bar">
          <img src="/assets/icons/gear-solid-full.svg" width="25" onClick={() => setSettingsOpen(true)} />
        </div>
      </div>
    </>
  )
}