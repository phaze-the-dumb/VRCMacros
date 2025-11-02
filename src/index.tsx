/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { NodeManager } from "./Mangers/NodeManager";
import { ConfirmationManager } from "./Mangers/ConfirmationManager";

new NodeManager();
new ConfirmationManager();

render(() => <App />, document.getElementById("root") as HTMLElement);
