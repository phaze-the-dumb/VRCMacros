import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeConditionalIfTrue: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'If True',
  typeId: 'iftrue',

  w: 220,

  statics: [{
    type: NodeType.Label,
    name: 'If True',
    value: null
  }],

  inputs: [
    { name: "Flow", type: NodeType.Flow },
    { name: "Input", type: NodeType.Boolean },
  ],

  outputs: [
    { name: "Is True", type: NodeType.Flow },
    { name: "Not True", type: NodeType.Flow },
  ],

  onStaticsUpdate: async ( _node: Node ) => { }
}