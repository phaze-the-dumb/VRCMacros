import { NodeManager } from "../Mangers/NodeManager";
import { PositionInfo } from "../renderer";
import { Node } from "../structs/node";

export let NodeContextMenu = ( clickedNode: Node ) => [
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

      // TODO: If node is currently selected, deselect it.
      NodeManager.Instance.RemoveNode(clickedNode!)
    },
    hovered: false
  }
]