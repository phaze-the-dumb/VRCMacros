import { Accessor, Setter } from "solid-js";
import { Node } from "./node";

export interface Tab{
  name: string,
  id: string,
  nodes: Node[],
  saveLocation: string | null,

  selected: Accessor<boolean>,
  setSelected: Setter<boolean>

  needsSave: Accessor<boolean>,
  setNeedsSave: Setter<boolean>,

  needSync: boolean
}