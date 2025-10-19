import { createSignal, For, onMount } from 'solid-js';
import './TabMenu.css';
import { NodeManager } from '../Mangers/NodeManager';
import { Tab } from '../structs/Tab';

export let TabMenu = () => {
  let [ tabImportOpen, setTabImportOpen ] = createSignal(false);
  let [ tabs, setTabs ] = createSignal<Tab[]>([], { equals: false });

  let closeTabImportMenu = () => {
    window.removeEventListener('click', closeTabImportMenu);
    setTabImportOpen(false);
  }

  onMount(() => {
    NodeManager.Instance.HookTabUpdate(setTabs);
  });

  return (
    <div class="tab-menu">
      <For each={Object.values(tabs())}>
        {
          tab =>
          <div class={ tab.selected() ? 'tab-selected ' : 'tab' }>
            <div class="tab-icon" onClick={() => {
              NodeManager.Instance.SelectTab(tab.id);
            }}><img src="/assets/icons/pen-to-square-regular-full.svg" width="15" /></div>
            <div class="tab-meta" onClick={() => {
              NodeManager.Instance.SelectTab(tab.id);
            }} onDblClick={( e ) => {
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
              NodeManager.Instance.CloseTab(tab.id);
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
        <div class="tab-new-dropdown" style={{ opacity: tabImportOpen() ? 1 : 0 }}>
          <div class="tab">Import from file</div>
          <div class="tab">Import from URL</div>
        </div>
        <div class="tab-icon"><img src="/assets/icons/plus-solid-full.svg" width="15" /></div>
        <div class="tab-meta">New Tab</div>
      </div>
    </div>
  )
}