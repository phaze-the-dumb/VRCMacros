import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeStaticsInt: NodeDefinition = {
  isSingle: true,
  name: 'Int',
  typeId: 'ifelse',

  w: 200,
  h: 85,

  statics: [{
    type: NodeType.Int,
    name: 'Value',
    value: null
  }],

  outputs: [{ name: "Int", type: NodeType.Int }],

  onStaticsUpdate: async ( _node: Node ) => {}
}