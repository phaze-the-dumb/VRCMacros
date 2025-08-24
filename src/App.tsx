import "./App.css";

import { createEffect, createSignal } from "solid-js";

import { Sidebar } from "./Components/Sidebar";
import { Actions } from "./Components/Actions";
import { Relays } from "./Components/Relays";
import { animate } from "animejs";
import { Settings } from "./Components/Settings";
import { Debug } from "./Components/Debug";

let App = () => {
  let [ page, setPage ] = createSignal(0);
  let carousel!: HTMLDivElement;

  createEffect(() => {
    let pagenum = page();
    animate(carousel.children, { translateY: '-' + ( 100 * pagenum ) + '%', ease: 'outElastic(.1, .7)', duration: 500 });
  })

  return (
    <>
      <Sidebar setPage={setPage} />

      <div app-carousel ref={carousel}>
        <Actions />
        <Relays />
        <Debug page={page} />
        <Settings />
      </div>
    </>
  );
}

export default App;
