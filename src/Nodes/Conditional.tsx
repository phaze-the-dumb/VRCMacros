import { NodeDefinition } from "./Nodes";

import { NodeConditionalIfEqual } from "./Conditional/IfEqual";
import { NodeConditionalIfTrue } from "./Conditional/IfTrue";
import { NodeConditionalIfFalse } from "./Conditional/IfFalse";

export let NodeConditional: NodeDefinition = {
  isSingle: false,
  name: 'Conditional',
  items: [
    NodeConditionalIfEqual,
    NodeConditionalIfTrue,
    NodeConditionalIfFalse
  ]
}