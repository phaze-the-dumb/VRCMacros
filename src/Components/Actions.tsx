import { For } from 'solid-js';
import './Actions.css';
import { TriggerEl } from './TriggerEl';
import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';

export interface Trigger{
  id: string,
  address: string,
  actions: any[]
}

export let Actions = () => {
  let [ triggers, setTriggers ] = createStore<Trigger[]>([]);

  invoke<Trigger[]>('list_triggers').then(triggers => { setTriggers(triggers) })

  return (
    <div app-page>
      <div app-col>
        <div style={{ width: '100%' }}><h1>Actions</h1></div>
        <div app-button style={{ width: 'fit-content', "margin-left": '50%' }} onClick={() => {
          let id = Math.random().toString().replace('0.', '');

          invoke('new_trigger', { id });
          setTriggers(( trig ) => [
            ...trig,
            { address: '', actions: [], id }
          ]);
        }}>+</div>
      </div>

      <For each={triggers}>
        { ( item, index ) => <TriggerEl
          trigger={item}
          onDelete={() => {
            invoke('rm_trigger', { indx: index() });
            setTriggers(( trig ) => trig.filter(x => x.id !== item.id));
          }}
          onAddAction={( action ) => {
            invoke('add_trigger_action', { indx: index(), action });
            setTriggers(index(), "actions", ( actions ) => [ ...actions, action ]);
          }}
          onDeleteAction={( id, indx ) => {
            invoke('rm_trigger_action', { indx: index(), actionIndx: indx });
            setTriggers(index(), "actions", ( actions ) => actions.filter(x => x.id !== id))
          }}
          onSetActionType={( i, type ) => {
            invoke('set_trigger_action_type', { indx: index(), actionIndx: i, actionType: type });
            setTriggers(index(), "actions", i, "actionType", type)
          }}
          onSetOSCAddress={( address ) => {
            invoke('set_trigger_address', { indx: index(), address });
          }} /> }
      </For>
    </div>
  )
}