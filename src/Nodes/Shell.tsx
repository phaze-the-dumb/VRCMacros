import { Node, NodeType } from "../structs/node";
import { NodeDefinition } from "./Nodes";

export let NodeShellCommand: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'Shell Command',
  typeId: 'shellcommand',

  w: 200,

  statics: [],

  inputs: [
    {
      name: "Flow",
      type: NodeType.Flow,
    },
    {
      name: "Command",
      type: NodeType.String,
    },
  ],

  outputs: [
    {
      name: "Flow",
      type: NodeType.Flow,
    },
    {
      name: "Output",
      type: NodeType.String,
    },
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
};