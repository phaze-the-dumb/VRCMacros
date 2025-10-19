import { PositionInfo } from "../renderer";
import { Node } from "../structs/node";
import { screenToWorldSpace } from "../utils/interections";
import { NodeManager } from "../Mangers/NodeManager";
import { ContextMenuItem } from "../structs/ContextMenu";
import { Nodes } from "../Nodes/Nodes";

export let CanvasContextMenu: ContextMenuItem[] = Nodes.map(( node ) => {
  if(node.isSingle){
    return {
      text: node.name,
      clicked: async ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
        let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);
        let id = await NodeManager.Instance.GetNewNodeId();

        NodeManager.Instance.AddNode(new Node(pos, node, id));
      },
      hovered: false
    }
  } else{
    return {
      text: node.name,
      menu: {
        items: node.items!.map(x => {
          return {
            text: x.name,
            clicked: async ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
              let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);
              let id = await NodeManager.Instance.GetNewNodeId();

              NodeManager.Instance.AddNode(new Node(pos, x, id));
            },
            hovered: false
          }
        }),
        position: [ 0, 0 ],
        size: [ 0, 0 ],
        visible: true
      },
      hovered: false
    }
  }
});