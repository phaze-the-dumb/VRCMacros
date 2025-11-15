import { NodeManager } from "../Mangers/NodeManager";
import { NodesByID } from "../Nodes/Nodes";
import { Node } from "../structs/node";

export let encodeNodeList = ( selectedNodes: Node[], mousePos: [ number, number ] ): string => {
  let arr: any[] = [];

  for(let node of selectedNodes){
    arr.push({
      id: node.id,
      type_id: node.typeId,
      statics: node.statics,
      x: node.x - mousePos[0],
      y: node.y - mousePos[1],
      outputs: node.outputs.map(x => {
        return x.connections.map(x => {
          return { node: x.parent.id, index: x.index } }) })
    })
  }

  for(let node of arr){
    for(let output of node.outputs){
      for(let i in output){
        let indx = arr.findIndex(x => x.id === output[i].node);
        if(indx === -1)
          delete output[i];
        else
          output[i].node = indx;
      }
    }
  }

  for(let node of arr)delete node.id;

  console.log(arr);
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

  for(let i in nodes){
    let outputs: { node: number, index: number }[][] = json[i].outputs;
    let node = nodes[i];

    for(let j in outputs){
      let output = node.outputs[j];

      for(let k in outputs[j]){
        let connection = outputs[j][k];
        if(!connection)continue;

        let peerNode = nodes[connection.node];
        let input = peerNode.inputs[connection.index];

        output.connections.push(input);
        input.connections.push(output);
      }
    }
  }

  return nodes;
}