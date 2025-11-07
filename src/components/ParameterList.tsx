import { createSignal, For, Show } from 'solid-js';
import './ParameterList.css';

export interface ParameterListProps{
  setPopupOpen: ( open: boolean ) => void
  value: { type: string, desc: string }[],
  changed: ( value: { type: string, desc: string }[] ) => void
}

// TODO: An actual parameter list
export let ParameterList = ( props: ParameterListProps ) => {
  let [ parameters, setParameters ] = createSignal<{ type: string, desc: string }[]>(props.value, { equals: false });
  let [ addParametersOpen, setAddParametersOpen ] = createSignal(false);

  return (
    <div class="parameter-list">
      <div class="parameter-list-inner">
        <div class="parameter-list-header">
          <h1 style={{ float: 'left' }}>Parameter List</h1>
          <div style={{ float: 'right' }} class="parameter-list-close">
            <div style={{ background: 'red', width: '25px', height: '25px', cursor: 'pointer' }} onClick={() => props.setPopupOpen(false)}></div>
          </div>
        </div>
        <div class="parameter-list-content">
          <For each={parameters()}>
            { i => <div>{ JSON.stringify(i) }</div>}
          </For>
          <div class="button" onClick={() => { setAddParametersOpen(!addParametersOpen()) }}>Add Parameter + </div>
          <Show when={addParametersOpen()}>
            <div class="parameter-list-button-dropdown">
              <div onClick={() => {
                setAddParametersOpen(false);

                let params = parameters();
                params.push({ type: 'Float', desc: '' });

                setParameters(params);
                props.changed(params);
              }}>Float Parameter</div>
              <div onClick={() => {
                setAddParametersOpen(false);

                let params = parameters();
                params.push({ type: 'Int', desc: '' });

                setParameters(params);
                props.changed(params);
              }}>Integer Parameter</div>
              <div onClick={() => {
                setAddParametersOpen(false);

                let params = parameters();
                params.push({ type: 'Boolean', desc: '' });

                setParameters(params);
                props.changed(params);
              }}>Boolean Parameter</div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}