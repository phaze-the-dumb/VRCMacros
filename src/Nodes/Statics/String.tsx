import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeStaticsString: NodeDefinition = {
  isSingle: true,
  name: 'String',
  typeId: 'staticstring',

  w: 200,
  h: 85,

  statics: [{
    type: NodeType.String,
    name: 'Value',
    value: 'Hello World!'
  }],

  outputs: [{ name: "String", type: NodeType.String }],

  onStaticsUpdate: async ( _node: Node ) => {}
}