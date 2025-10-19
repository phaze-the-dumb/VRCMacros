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
    value: null
  }],

  outputs: [{ name: "String", type: NodeType.String }],

  onStaticsUpdate: ( _node: Node ) => {}
}