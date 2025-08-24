import { For } from "solid-js"
import { Trigger } from "./Actions"
import { TextInput } from "./TextInput"
import { invoke } from "@tauri-apps/api/core"

export interface TriggerElProps{
  trigger: Trigger,

  onDelete: () => void
}

export let TriggerEl = ( { trigger, onDelete }: TriggerElProps ) => {
  let suggestOSCAddresses = async ( text: string ): Promise<string[]> => {
    let addresses = await invoke<string[]>('get_addresses');
    return addresses.filter(x => x.toLowerCase().includes(text.toLowerCase()));
  }

  return (
    <div app-trigger-el>
      <div app-col>
        OSC Address:
        <div style={{ width: '400px', display: 'inline-block', "margin-left": '10px' }}>
          <TextInput placeholder="/avatar/parameters/MyValue" value={ trigger.address } requestSuggestions={suggestOSCAddresses} />
        </div>
        <div app-icon style={{ 'margin-left': 'calc(100% - 545px)' }} onClick={onDelete}>
          <img src="/assets/icons/trash-can-solid-full.svg" width="18" />
        </div>
      </div>

      <br />
      <For each={trigger.actions()}>
        { item => <div app-trigger-action app-col>
          <div style={{ width: 'calc(100% - 40px)', height: '30px', display: 'flex', "justify-content": 'center', 'align-items': 'center' }}>
            <TextInput placeholder="Search Actions..." />
          </div>
          <div app-icon style={{ width: '40px' }} onClick={() => {
            let actions = trigger.actions();
            actions = actions.filter(( x: any ) => x !== item);

            trigger.setActions(actions);
          }}>
            <img src="/assets/icons/trash-can-solid-full.svg" width="18" />
          </div>
        </div> }
      </For>

      <br />
      <div app-button onClick={() => {
        let actions = trigger.actions();
        actions.push({});

        trigger.setActions(actions);
      }}>Add Action +</div>
    </div>
  )
}