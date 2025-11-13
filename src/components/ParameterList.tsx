import { createSignal, For, Show } from 'solid-js';
import './ParameterList.css';

export interface ParameterListProps{
  setPopupOpen: ( open: boolean ) => void
  value: { type: string, desc: string }[],
  changed: ( value: { type: string, desc: string }[] ) => void
}

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
            { ( i, index ) => <div style={{ display: 'flex' }}>
              <div class="parameter-list-parameter">{ i.desc === "" ? i.type : i.desc + ` ${i.type}` }</div>
              <div class="parameter-list-parameter parameter-list-parameter-delete" onClick={() => {
                let params = parameters();
                params.splice(index(), 1);

                setParameters(params);
                props.changed(params);
              }}>
                <img src="/assets/icons/trash-can-solid-full.svg" width="20" />
              </div>
            </div>}
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