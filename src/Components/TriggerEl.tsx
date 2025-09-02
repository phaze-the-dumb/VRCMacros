import { For } from "solid-js"
import { Trigger } from "./Actions"
import { TextInput } from "./TextInput"
import { invoke } from "@tauri-apps/api/core"
import { ActionType } from "../Structs/ActionType"

export interface TriggerElProps{
  trigger: Trigger,

  onDelete: () => void,

  onAddAction: ( value: any ) => void,
  onDeleteAction: ( id: string, index: number ) => void,

  onSetActionType: ( index: number, type: string | null ) => void,

  onSetOSCAddress: ( address: string ) => void,
}

export let TriggerEl = ( { trigger, onDelete, onAddAction, onDeleteAction, onSetActionType, onSetOSCAddress }: TriggerElProps ) => {
  let suggestOSCAddresses = async ( text: string ): Promise<string[]> => {
    let addresses = await invoke<string[]>('get_addresses');
    return addresses.filter(x => x.toLowerCase().includes(text.toLowerCase()));
  }

  let suggestActionNames = async ( text: string ): Promise<string[]> => {
    let actions = await invoke<ActionType[]>('get_actions');
    return actions.filter(x => x.name.toLowerCase().includes(text.toLowerCase())).map(x => x.name);
  }

  return (
    <div app-trigger-el>
      <div app-col>
        OSC Address:
        <div style={{ width: '400px', display: 'inline-block', "margin-left": '10px' }}>
          <TextInput
            placeholder="/avatar/parameters/MyValue"
            value={ trigger.address }
            requestSuggestions={suggestOSCAddresses}
            change={onSetOSCAddress} />
        </div>
        <div app-icon style={{ 'margin-left': 'calc(100% - 545px)' }} onClick={onDelete}>
          <img src="/assets/icons/trash-can-solid-full.svg" width="18" />
        </div>
      </div>

      <br />
      <For each={trigger.actions}>
        { ( item, index ) => <div app-trigger-action>
          <div app-col>
            <div style={{ width: 'calc(100% - 40px)', height: '30px', display: 'flex', "justify-content": 'center', 'align-items': 'center' }}>
              <TextInput
                placeholder="Search Actions..."
                requestSuggestions={suggestActionNames}
                value={item.actionType}
                change={async ( text: string ) => {
                  let action = await invoke<ActionType>('get_action', { name: text });
                  if(action)onSetActionType(index(), action.name);
                  else onSetActionType(index(), null);
                }} />
            </div>
            <div app-icon style={{ width: '40px' }} onClick={() => {
              onDeleteAction(item.id, index());
            }}>
              <img src="/assets/icons/trash-can-solid-full.svg" width="18" />
            </div>
          </div>

          <div>

          </div>
        </div> }
      </For>

      <br />
      <div app-button onClick={() => {
        onAddAction({ id: Math.random().toString().replace('0.', '') })
      }}>Add Action +</div>
    </div>
  )
}