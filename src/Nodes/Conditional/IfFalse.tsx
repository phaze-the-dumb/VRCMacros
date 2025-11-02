import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeConditionalIfFalse: NodeDefinition = {
  isSingle: true,
  name: 'If False',
  typeId: 'iffalse',

  w: 220,
  h: 150,

  statics: [{
    type: NodeType.Label,
    name: 'If False',
    value: null
  }],

  inputs: [
    { name: "Flow", type: NodeType.Flow },
    { name: "Input", type: NodeType.Boolean },
  ],

  outputs: [
    { name: "Is False", type: NodeType.Flow },
    { name: "Not False", type: NodeType.Flow },
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
}