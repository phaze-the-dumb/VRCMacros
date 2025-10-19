import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeConditionalIfTrue: NodeDefinition = {
  isSingle: true,
  name: 'If True',
  typeId: 'iftrue',

  w: 220,
  h: 150,

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

  onStaticsUpdate: (_node: Node) => { }
}