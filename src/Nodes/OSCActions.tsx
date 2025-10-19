import { NodeDefinition } from "./Nodes";
import { NodeOSCActionsSendChatbox } from "./OSCActions/Send Chatbox";

export let NodeOSCActions: NodeDefinition = {
  isSingle: false,
  name: 'OSC Actions',
  items: [
    NodeOSCActionsSendChatbox
  ]
}