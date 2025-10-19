import { NodeDefinition } from "./Nodes";

import { NodeStaticsInt } from "./Statics/Int";
import { NodeStaticsString } from "./Statics/String";

export let NodeStatics: NodeDefinition = {
  isSingle: false,
  name: 'Statics',
  items: [
    NodeStaticsInt,
    NodeStaticsString
  ]
}