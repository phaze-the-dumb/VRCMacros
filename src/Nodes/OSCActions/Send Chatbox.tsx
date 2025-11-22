import { Node, NodeType } from "../../structs/node";
import { NodeDefinition } from "../Nodes";

export let NodeOSCActionsSendChatbox: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'Send Chatbox',
  typeId: 'oscsendchatbox',

  w: 200,
  h: 120,

  statics: [{
    type: NodeType.Label,
    name: 'Send Chatbox',
    value: null
  }],

  inputs: [
    { name: "Flow", type: NodeType.Flow },
    { name: "Value", type: NodeType.String }
  ],

  onStaticsUpdate: async ( _node: Node ) => {}
}