import { Node, NodeType } from "../structs/node";
import { NodeDefinition } from "./Nodes";

export let NodeDebug: NodeDefinition = {
  isSingle: true,
  name: 'Debug',
  typeId: 'debug',

  w: 200,
  h: 110,

  statics: [
    {
      name: "Debug",
      type: NodeType.Label,
      value: null
    }
  ],

  inputs: [
    {
      name: "Flow",
      type: NodeType.Flow,
    },
    {
      name: "Value",
      type: NodeType.AnyTypeA,
    }
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
};