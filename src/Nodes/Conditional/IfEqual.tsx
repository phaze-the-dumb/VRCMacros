import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeConditionalIfEqual: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'If Equal',
  typeId: 'ifequal',

  w: 220,

  statics: [{
    type: NodeType.Label,
    name: 'If Equal',
    value: null
  }],

  inputs: [
    { name: "Flow", type: NodeType.Flow },
    { name: "Input 1", type: NodeType.AnyTypeA },
    { name: "Input 2", type: NodeType.AnyTypeA },
  ],

  outputs: [
    { name: "Equal", type: NodeType.Flow },
    { name: "Not Equal", type: NodeType.Flow },
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
}