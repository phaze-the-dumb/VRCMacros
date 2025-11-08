import { Accessor } from "solid-js";
import { NodeManager } from "./Mangers/NodeManager";
import { Node } from "./structs/node";

let isKeyDown: any = {};

export let load = ( selectedNode: Accessor<Node | null> ) => {
  // TODO: Keybind system
  // TODO: Delete selected node when delete key is pressed
  // TODO: Copy / paste
  // TODO: Add undo / redo -ing

  window.onkeydown = ( e ) => {
    isKeyDown[e.key] = true;

    console.log(e.key);

    switch(e.key){
      case 'Delete':
        let node = selectedNode();
        if(!node)return;

        node.inputs.map(input => {
          input.connections.map(partner => {
            partner.connections = partner.connections.filter(x => x != input);
          })
        })

        node.outputs.map(output => {
          output.connections.map(partner => {
            partner.connections = partner.connections.filter(x => x != output);
          })
        })

        // TODO: If node is currently selected, deselect it.
        NodeManager.Instance.RemoveNode(node);
        break;
      case 's':
        if(e.ctrlKey){
          let currentTab = NodeManager.Instance.CurrentTab();
          if(!currentTab)return;

          // Save
          NodeManager.Instance.SaveTab(currentTab);
        }
        break;
      case 'S':
        if(e.ctrlKey){
          let currentTab = NodeManager.Instance.CurrentTab();
          if(!currentTab)return;

          // Save
          NodeManager.Instance.SaveTab(currentTab, true);
        }
        break;
    }
  }

  window.onkeyup = ( e ) => {
    isKeyDown[e.key] = false;
  }
}