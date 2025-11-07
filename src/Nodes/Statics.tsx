import { NodeDefinition } from "./Nodes";
import { NodeStaticsFloat } from "./Statics/Float";

import { NodeStaticsInt } from "./Statics/Int";
import { NodeStaticsString } from "./Statics/String";

export let NodeStatics: NodeDefinition = {
  isSingle: false,
  name: 'Statics',
  items: [
    NodeStaticsInt,
    NodeStaticsString,
    NodeStaticsFloat
  ]
}