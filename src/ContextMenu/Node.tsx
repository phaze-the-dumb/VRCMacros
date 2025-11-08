import { Accessor, Setter } from "solid-js";
import { NodeManager } from "../Mangers/NodeManager";
import { PositionInfo } from "../renderer";
import { Node } from "../structs/node";

export let NodeContextMenu = ( clickedNode: Node, selectedNode: Accessor<Node | null>, setSelectedNode: Setter<Node | null>  ) => [
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
      if(selected && clickedNode.id === selected.id)setSelectedNode(null);

      NodeManager.Instance.RemoveNode(clickedNode!)
    },
    hovered: false
  }
]