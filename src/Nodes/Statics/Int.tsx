import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeStaticsInt: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'Int',
  typeId: 'staticint',

  w: 200,
  h: 80,

  statics: [{
    type: NodeType.Int,
    name: 'Value',
    value: 0
  }],

  outputs: [{ name: "Int", type: NodeType.Int }],

  onStaticsUpdate: async ( _node: Node ) => {}
}