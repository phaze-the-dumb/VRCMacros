import { Accessor, Setter } from "solid-js";
import { NodeManager } from "../Mangers/NodeManager";
import { PositionInfo } from "../renderer";
import { Node } from "../structs/node";

export let NodeContextMenu = ( clickedNode: Node, selectedNode: Accessor<Node[]>, setSelectedNode: Setter<Node[]>  ) => [
  {
    text: "Delete Node",
    clicked: ( _e: MouseEvent, _canvas: HTMLCanvasElement, _position: PositionInfo ) => {
      clickedNode!.inputs.map(input => {
        input.connections.map(partner => {
          partner.connections = partner.connections.filter(x => x != input);
        })
      })

      clickedNode!.outputs.map(output => {
        output.connections.map(partner => {
          partner.connections = partner.connections.filter(x => x != output);
        })
      })

      let selected = selectedNode();
      for (let i = 0; i < selected.length; i++) {
        let node = selected[i];

        if(node.id === clickedNode.id){
          selected.splice(i, 1);
          setSelectedNode(selected);

          break;
        }
      }

      NodeManager.Instance.RemoveNode(clickedNode!)
    },
    hovered: false
  }
]