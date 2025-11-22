import { NodeDefinition } from "./Nodes";

import { NodeConditionalIfEqual } from "./Conditional/IfEqual";
import { NodeConditionalIfTrue } from "./Conditional/IfTrue";
import { NodeConditionalIfFalse } from "./Conditional/IfFalse";

export let NodeConditional: NodeDefinition = {
  os: 'any',

  isSingle: false,
  name: 'Conditional',
  items: [
    NodeConditionalIfEqual,
    NodeConditionalIfTrue,
    NodeConditionalIfFalse
  ]
}