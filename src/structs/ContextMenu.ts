import { PositionInfo } from "../renderer";
import { Node } from "./node";

export interface ContextMenuItem{
  text: string,
  hovered: boolean,
  clicked?: ( e: MouseEvent, canvas: HTMLCanvasElement, pos: PositionInfo, clickedNode?: Node ) => void,
  menu?: ContextMenu
}

export interface ContextMenu{
  items: ContextMenuItem[];
  position: [ number, number ];
  size: [ number, number ];
  visible: boolean;
}