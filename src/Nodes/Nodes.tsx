import { Node, NodeStatic, NodeType } from "../structs/node";
import { platform } from '@tauri-apps/plugin-os';

import { NodeConditional } from "./Conditional";
import { NodeDebug } from "./Debug";
import { NodeOSCActions } from "./OSCActions";
import { NodeOSCTrigger } from "./OSCTrigger";
import { NodePressKey } from "./PressKey";
import { NodeStatics } from "./Statics";
import { NodeShellCommand } from "./Shell";

export interface NodeDefinition{
  os: string,
  isSingle: boolean,
  name: string,
  typeId?: string,
  onStaticsUpdate?: ( node: Node ) => Promise<void>,
  // build?: ( pos: [ number, number ], onStaticsUpdate: ( node: Node ) => void ) => Promise<Node>,
  w?: number,
  statics?: NodeStatic[],
  inputs?: { name: string, type: NodeType }[],
  outputs?: { name: string, type: NodeType }[],

  items?: NodeDefinition[]
}

export interface NodeDefinitionHashMap {
  [details: string] : NodeDefinition;
}

// TODO: (Node Additions) Pressing keyboard keys (like to do linux, but has extra steps)
// TODO: (Node Additions) Getting media state from os
// TODO: (Node Additions) Sending custom OSC messages
// TODO: (Node Additions) Sending HTTP requests?
// TODO: (Node Additions) Voicemeeter integrations (win only)
// TODO: (Node Additions) Voicemod integrations (win only)
// TODO: (Node Additions) Executing shell commands? (probably need some kinda popup warning when these are imported about dangerous usage)

export let Nodes: NodeDefinition[] = [];
let nodes = [
  NodeOSCTrigger,
  NodeConditional,
  NodeStatics,
  NodeOSCActions,
  NodeDebug,
  NodePressKey,
  NodeShellCommand
]

let os = platform();

for (let i = 0; i < nodes.length; i++) {
  let node = nodes[i];
  if(node.os === 'any' || node.os === os)Nodes.push(node);
}

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