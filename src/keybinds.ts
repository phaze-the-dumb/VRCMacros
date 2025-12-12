import { Accessor, Setter } from "solid-js";
import { NodeManager } from "./Mangers/NodeManager";
import { Node } from "./structs/node";
import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { decodeNodeList, encodeNodeList } from "./utils/clipboard";

let isKeyDown: any = {};

export let load = ( canvas: HTMLCanvasElement, mousePos: Accessor<[ number, number ]>, selectedNode: Accessor<Node[]>, setSelectedNode: Setter<Node[]> ) => {
  // TODO: Add undo / redo -ing

  canvas.onkeydown = async ( e ) => {
    switch(e.key){
      case 'Delete':
        let nodes = selectedNode();
        for(let node of nodes){
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

          NodeManager.Instance.RemoveNode(node);
        }

        setSelectedNode([]);
        break;
    }
  }

  window.onkeydown = async ( e ) => {
    isKeyDown[e.key] = true;

    switch(e.key){
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
      case 'c':
        if(e.ctrlKey){
          let nodes = selectedNode();
          await writeText(encodeNodeList(nodes, mousePos()));
        }
        break;
      case 'v':
        if(e.ctrlKey){
          let text = await readText();

          let nodes = await decodeNodeList(text, mousePos());
          if(!nodes)return;

          for(let node of nodes)
            NodeManager.Instance.AddNode(node);

          setSelectedNode(nodes);
        }
        break;
      case 'z':
        if(e.ctrlKey){
          console.log('undo');
        }
        break;
      case 'y':
        if(e.ctrlKey){
          console.log('redo');
        }
        break;
    }
  }

  window.onkeyup = ( e ) => {
    isKeyDown[e.key] = false;
  }
}