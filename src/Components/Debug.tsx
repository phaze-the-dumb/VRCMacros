import './Debug.css';

import { createEffect, onCleanup, onMount } from 'solid-js';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { OSCMessage, OSCValue } from '../Structs/OSCMessage';

let formatValuesForDebug = ( values: OSCValue[] ): string => {
  let text = '';

  for(let value of values){
    if(value.Boolean !== undefined)
      text += ' Boolean: ' + value.Boolean;
    else if(value.Float !== undefined)
      text += ' Float: ' + value.Float.toFixed(6);
    else if(value.Int !== undefined)
      text += ' Int: ' + value.Int;
    else if(value.String !== undefined)
      text += ' String: ' + value.String;
  }

  return text.trimStart();
}

export interface DebugProps{
  page: () => number
}

export let Debug = ( props: DebugProps ) => {
  let debugContainer!: HTMLDivElement;

  let debugEls: any = {};

  let isListening = false;
  let unlisten: UnlistenFn;

  let stopListening = () => {
    if(!isListening)return;
    isListening = false;

    unlisten();
  }

  let startListening = async () => {
    if(isListening)return;
    isListening = true;

    unlisten = await listen<OSCMessage>('osc-message', ( ev ) => {
      let el = debugEls[ev.payload.address];
      if(el){
        el.style.boxShadow = '#00ccff 0 0 10px';
        debugContainer.insertBefore(el, debugContainer.firstChild);

        el.innerHTML = `<div><span>${ ev.payload.address }</span></div><div>${ formatValuesForDebug(ev.payload.values) }</div>`;
        setTimeout(() => { el.style.boxShadow = '#00ccff 0 0 0px'; })
      } else{
        el = <div app-debug-el app-col-50><div><span>{ ev.payload.address }</span></div><div>{ formatValuesForDebug(ev.payload.values) }</div></div> as Node;

        el.style.boxShadow = '#00ccff 0 0 10px';
        debugContainer.insertBefore(el, debugContainer.firstChild);

        setTimeout(() => { el.style.boxShadow = '#00ccff 0 0 0px'; })
        debugEls[ev.payload.address] = el;
      }
    })
  }

  onMount(() => {
    createEffect(() => {
      if(props.page() === 2)
        startListening();
      else
        stopListening();
    });
  });

  onCleanup(() => {
    stopListening();
  });

  return (
    <div app-page>
      <h1>Debug</h1>

      <div ref={debugContainer}>

      </div>
    </div>
  )
}