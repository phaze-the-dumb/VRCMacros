import { Node, NodeStatic, NodeType } from "../structs/node";

import { NodeConditional } from "./Conditional";
import { NodeDebug } from "./Debug";
import { NodeOSCActions } from "./OSCActions";
import { NodeOSCTrigger } from "./OSCTrigger";
import { NodeStatics } from "./Statics";

export interface NodeDefinition{
  isSingle: boolean,
  name: string,
  typeId?: string,
  onStaticsUpdate?: ( node: Node ) => Promise<void>,
  // build?: ( pos: [ number, number ], onStaticsUpdate: ( node: Node ) => void ) => Promise<Node>,
  w?: number,
  h?: number,
  statics?: NodeStatic[],
  inputs?: { name: string, type: NodeType }[],
  outputs?: { name: string, type: NodeType }[],

  items?: NodeDefinition[]
}

export interface NodeDefinitionHashMap {
  [details: string] : NodeDefinition;
}

export let Nodes: NodeDefinition[] = [
  NodeOSCTrigger,
  NodeConditional,
  NodeStatics,
  NodeOSCActions,
  NodeDebug
]

export let NodesByID: NodeDefinitionHashMap = {}

Nodes.forEach(node => {
  if(node.isSingle){
    NodesByID[node.typeId!] = node;
  } else{
    node.items!.forEach(node => {
      NodesByID[node.typeId!] = node;
    })
  }
})

console.log(NodesByID);