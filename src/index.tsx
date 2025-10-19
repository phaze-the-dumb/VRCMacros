/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { NodeManager } from "./Mangers/NodeManager";
new NodeManager();

render(() => <App />, document.getElementById("root") as HTMLElement);
