import './ControlBar.css';

import { Accessor, createEffect, createSignal, For, Match, Show, Switch } from 'solid-js';
import { Node, NodeType } from '../structs/node';
import { TextInput } from './TextInput';
import { invoke } from '@tauri-apps/api/core';
import { OSCMessage } from '../structs/OscMessage';
import { ParameterList } from './ParameterList';
import { NodeManager } from '../Mangers/NodeManager';

export interface ControlBarProps{
  node: Accessor<Node[]>,
  lockMovement: ( lock: boolean ) => void
}

export let ControlBar = ( props: ControlBarProps ) => {
  createEffect(() => {
    console.log(props.node());
  })

  return (
    <div class="control-bar">
      <For each={props.node()[0]?.statics}>
        { ( item ) => {
          let [ popupOpen, setPopupOpen ] = createSignal(false);

          return (
            <div>
              <Switch>
                <Match when={item.type == NodeType.String}>
                  { item.name }
                  <div style={{ display: 'inline-block', 'margin-left': '10px' }}>
                    <input
                      type="text"
                      placeholder='Enter Value...'
                      value={item.value || ''}
                      onChange={( el ) => {
                        let value = el.target.value;
                        let node = props.node()[0]!;

                        item.value = value;
                        node.onStaticsUpdate(node);

                        NodeManager.Instance.UpdateConfig();
                      }} />
                  </div>
                </Match>
                <Match when={item.type == NodeType.Int}>
                  { item.name }
                  <div style={{ display: 'inline-block', 'margin-left': '10px' }}>
                    <input
                      type="number"
                      placeholder='Enter Value...'
                      value={item.value !== undefined ? item.value : ''}
                      onChange={( el ) => {
                        let value = el.target.value;
                        let node = props.node()[0]!;

                        item.value = parseInt(value);
                        node.onStaticsUpdate(node);

                        NodeManager.Instance.UpdateConfig();
                      }} />
                  </div>
                </Match>
                <Match when={item.type == NodeType.Float}>
                  { item.name }
                  <div style={{ display: 'inline-block', 'margin-left': '10px' }}>
                    <input
                      type="number"
                      placeholder='Enter Value...'
                      value={item.value !== undefined ? item.value : ''}
                      onChange={( el ) => {
                        let value = el.target.value;
                        let node = props.node()[0]!;

                        item.value = parseFloat(value);
                        node.onStaticsUpdate(node);

                        NodeManager.Instance.UpdateConfig();
                      }} />
                  </div>
                </Match>
                <Match when={item.type == NodeType.OSCAddress}>
                  { item.name }
                  <div style={{ display: 'inline-block', 'margin-left': '10px', width: '300px' }}>
                    <TextInput
                      placeholder='Enter OSC Address...'
                      value={item.value || ''}
                      requestSuggestions={async ( text: string ): Promise<string[]> => {
                        let addresses = await invoke<OSCMessage[]>('get_addresses');
                        return addresses.map(x => x.address).filter(x => x.toLowerCase().includes(text.toLowerCase()));
                      }}
                      change={( text ) => {
                        let node = props.node()[0]!;

                        item.value = text;
                        node.onStaticsUpdate(node);

                        NodeManager.Instance.UpdateConfig();
                      }} />
                  </div>
                </Match>
                <Match when={item.type == NodeType.ParameterList}>
                  <div class="button" onClick={() => {
                    let popup = !popupOpen();

                    props.lockMovement(popup);
                    setPopupOpen(popup);
                  }}>
                    { item.name }
                  </div>
                  <Show when={popupOpen()}>
                    <ParameterList
                      setPopupOpen={( open: boolean ) => {
                        setPopupOpen(open);
                        props.lockMovement(open);
                      }}
                      value={item.value}
                      changed={( value ) => {
                        let node = props.node()[0]!;

                        item.value = value;
                        node.onStaticsUpdate(node);

                        NodeManager.Instance.UpdateConfig();
                      }} />
                  </Show>
                </Match>
              </Switch>
            </div>
          )
        }}
      </For>
    </div>
  )
}