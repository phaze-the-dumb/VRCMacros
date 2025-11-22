import { NodeDefinition } from "./Nodes";
import { NodeOSCActionsSendChatbox } from "./OSCActions/Send Chatbox";

export let NodeOSCActions: NodeDefinition = {
  os: 'any',

  isSingle: false,
  name: 'OSC Actions',
  items: [
    NodeOSCActionsSendChatbox
  ]
}