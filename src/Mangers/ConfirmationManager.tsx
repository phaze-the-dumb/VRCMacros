import { Accessor, createSignal, Setter } from "solid-js";

export interface ConfirmationPopupButton{
  text: string,
  callback: () => void
}

export class ConfirmationManager{
  public static Instance: ConfirmationManager;

  private _setText: Setter<string>;
  public Text: Accessor<string>;

  private _setBody: Setter<string>;
  public Body: Accessor<string>;

  private _setButtons: Setter<ConfirmationPopupButton[]>;
  public Buttons: Accessor<ConfirmationPopupButton[]>;

  private _setShown: Setter<boolean>;
  public Shown: Accessor<boolean>;

  constructor(){
    ConfirmationManager.Instance = this;

    [ this.Text, this._setText ] = createSignal('');
    [ this.Body, this._setBody ] = createSignal('');
    [ this.Buttons, this._setButtons ] = createSignal<ConfirmationPopupButton[]>([]);
    [ this.Shown, this._setShown ] = createSignal(false);
  }

  public ShowConfirmation( text: string, body: string, buttons: ConfirmationPopupButton[] ): boolean{
    if(this.Shown())return false;

    this._setShown(true);

    this._setText(text);
    this._setBody(body);
    this._setButtons(buttons);

    return true;
  }

  public CancelConfirmation(){
    this._setShown(false);
  }
}