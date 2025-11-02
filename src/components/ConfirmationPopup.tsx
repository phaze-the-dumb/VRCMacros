import { For, Show } from 'solid-js';
import './ConfirmationPopup.css';
import { ConfirmationManager } from '../Mangers/ConfirmationManager';

export let ConfirmationPopup = () => {
  return (
    <>
      <Show when={ConfirmationManager.Instance.Shown()}>
        <div class="confirmation-blackout">
          <div class="confirmation-popup">
            <h2>{ConfirmationManager.Instance.Text()}</h2>
            <p>{ConfirmationManager.Instance.Body()}</p>
            
            <div class="confirmation-buttons">
              <For each={ConfirmationManager.Instance.Buttons()}>
                { item =>
                  <div
                    class="confirmation-button"
                    onClick={() => {
                      ConfirmationManager.Instance.CancelConfirmation();
                      item.callback();
                    }}
                  >
                    { item.text }
                  </div>
                }
              </For>

              <div
                class="confirmation-button"
                onClick={() => ConfirmationManager.Instance.CancelConfirmation()}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}