import { NodeManager } from "../Mangers/NodeManager";
import { NodesByID } from "../Nodes/Nodes";
import { Node } from "../structs/node";

export let encodeNodeList = ( selectedNodes: Node[], mousePos: [ number, number ] ): string => {
  let arr: any[] = [];

  for(let node of selectedNodes){
    arr.push({
      type_id: node.typeId,
      statics: node.statics,
      x: node.x - mousePos[0],
      y: node.y - mousePos[1]
    })
  }

  return 'VRCMACRO' + btoa(JSON.stringify(arr));
}

export let decodeNodeList = async ( text: string, mousePos: [ number, number ] ): Promise<Node[] | null> => {
  if(!text.startsWith("VRCMACRO"))return null;

  let data = text.slice(8);
  let json = JSON.parse(atob(data));

  let nodes: Node[] = [];
  for(let node of json){
    let n = new Node(
      [ node.x + mousePos[0] + 10, node.y + mousePos[1] + 10 ],
      NodesByID[node.type_id],
      await NodeManager.Instance.GetNewNodeId()
    );

    n.statics = node.statics;
    await n.onStaticsUpdate(n);

    nodes.push(n);
  }

  return nodes;
}