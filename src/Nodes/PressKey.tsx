import { Node, NodeType } from "../structs/node";
import { NodeDefinition } from "./Nodes";

export let NodePressKey: NodeDefinition = {
  os: 'windows',

  isSingle: true,
  name: 'Press Key',
  typeId: 'presskey',

  w: 200,
  h: 80,

  statics: [
    {
      name: "Key",
      type: NodeType.String,
      value: ""
    }
  ],

  inputs: [
    {
      name: "Flow",
      type: NodeType.Flow,
    }
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
};