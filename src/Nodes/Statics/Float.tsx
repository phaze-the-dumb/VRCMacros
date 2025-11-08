import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeStaticsFloat: NodeDefinition = {
  isSingle: true,
  name: 'Float',
  typeId: 'staticfloat',

  w: 200,
  h: 85,

  statics: [{
    type: NodeType.Float,
    name: 'Value',
    value: 0.0
  }],

  outputs: [{ name: "Float", type: NodeType.Float }],

  onStaticsUpdate: async ( _node: Node ) => {}
}