import './TextInput.css';

import { createSignal, For, Show } from "solid-js"

export interface TextInputProps{
  placeholder: string,
  value?: string,
  requestSuggestions?: ( text: string ) => Promise<string[]>,
  change?: ( text: string ) => void
}

export let TextInput = ( props: TextInputProps ) => {
  let [ suggestionsOpen, setSuggestionsOpen ] = createSignal(false);
  let [ suggestions, setSuggestions ] = createSignal<string[]>([])

  let input!: HTMLInputElement;

  let suggestionsContainer!: HTMLDivElement;
  let suggestionsIndex = 0;

  let onInput = async () => {
    let s = null;

    if(props.requestSuggestions){
      s = await props.requestSuggestions(input.value);

      if(s != suggestions()){
        setSuggestions(s);

        let open = s !== null && s.length > 0 && input.value.length > 0;

        setSuggestionsOpen(open);
        if(open)changeSelection(() => { suggestionsIndex = 0; });
      }
    }
  }

  let onKeyDown = ( ev: KeyboardEvent ) => {
    switch(ev.key){
      case 'ArrowDown':
        changeSelection(() => {
          suggestionsIndex++;
          if(suggestionsIndex >= suggestionsContainer.children.length)suggestionsIndex = suggestionsContainer.children.length - 1;
        });
        break;
      case 'ArrowUp':
        changeSelection(() => {
          suggestionsIndex--;
          if(suggestionsIndex < 0)suggestionsIndex = 0;
        });
        break;
      case 'Enter':
        let currentDiv = suggestionsContainer.children[suggestionsIndex];
        if(currentDiv)input.value = currentDiv.innerHTML;

        props.change ? props.change(input.value) : null
        setSuggestionsOpen(false);
        break;
    }
  }

  let changeSelection = ( cb: () => void )  => {
    for(let child of suggestionsContainer.children)
      child.classList.remove('suggestion-selected');

    cb();

    let height = suggestionsIndex * 19;
    suggestionsContainer.scrollTo(0, height - 150);

    let currentDiv = suggestionsContainer.children[suggestionsIndex];
    if(currentDiv)currentDiv.classList.add('suggestion-selected');
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <input
          style={{ width: '100%' }}
          type="text"
          placeholder={ props.placeholder }
          value={ props.value || "" }
          onChange={() => props.change ? props.change(input.value) : null}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onFocusOut={() => setTimeout(() => {
            setSuggestionsOpen(false);
            suggestionsIndex = -1;
          }, 100)}
          ref={input} />

        <Show when={suggestionsOpen()}>
          <div input-dropdown ref={suggestionsContainer}>
            <For each={suggestions()}>
              { item => <div onClick={( el ) => {
                let thisEl = el.target;

                input.value = thisEl.innerHTML;
                setSuggestionsOpen(false);

                props.change ? props.change(input.value) : null
                suggestionsIndex = -1;
              }}>{ item }</div> }
            </For>
          </div>
        </Show>
      </div>
    </>
  )
}