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

// TODO: (Node Additions) Pressing keyboard keys
// TODO: (Node Additions) Getting media state from os
// TODO: (Node Additions) Sending custom OSC messages
// TODO: (Node Additions) Sending HTTP requests?
// TODO: (Node Additions) Voicemeeter integrations (win only)
// TODO: (Node Additions) Voicemod integrations (win only)
// TODO: (Node Additions) Executing shell commands? (probably need some kinda popup warning when these are imported about dangerous usage)

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