import { Accessor, createSignal, For, Setter } from 'solid-js';
import './Actions.css';
import { TriggerEl } from './TriggerEl';

export interface Trigger{
  address: string,
  actions: Accessor<any>,
  setActions: Setter<any>
}

export let Actions = () => {
  let [ triggers, setTriggers ] = createSignal<Trigger[]>([], { equals: false });

  return (
    <div app-page>
      <div app-col>
        <div style={{ width: '100%' }}><h1>Actions</h1></div>
        <div app-button style={{ width: 'fit-content', "margin-left": '50%' }} onClick={() => {
          let trig = triggers();
          let [ actions, setActions ] = createSignal([], { equals: false });

          trig.push({ address: '', actions, setActions });
          setTriggers(trig);
        }}>+</div>
      </div>

      <For each={triggers()}>
        { ( item ) => <TriggerEl
          trigger={item}
          onDelete={() => {
            let trig = triggers();
            trig = trig.filter(x => x !== item);

            setTriggers(trig);
          }} /> }
      </For>
    </div>
  )
}