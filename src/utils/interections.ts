import { PositionInfo } from "../renderer";

export let screenToWorldSpace = ( canvas: HTMLCanvasElement, position: PositionInfo, pointX: number, pointY: number ): [ number, number ] => {
  let startX = canvas.width / -2;
  let startY = canvas.height / -2;

  let worldX = ((pointX + startX) / position.scale) - position.x - startX;
  let worldY = ((pointY + startY) / position.scale) - position.y - startY;

  return [ worldX, worldY ];
}

export let isPointInRectApplyOffset = ( canvas: HTMLCanvasElement, position: PositionInfo, pointX: number, pointY: number, rectX: number, rectY: number, rectW: number, rectH: number ): boolean => {
  let startX = canvas.width / -2;
  let startY = canvas.height / -2;

  let screenPointX = (pointX + startX);
  let screenPointY = (pointY + startY);

  let rectScreenX = (rectX + startX + position.x) * position.scale;
  let rectScreenY = (rectY + startY + position.y) * position.scale;
  let rectScreenW = rectW * position.scale;
  let rectScreenH = rectH * position.scale;

  return (
    screenPointX > rectScreenX &&
    screenPointX < rectScreenX + rectScreenW &&
    screenPointY > rectScreenY &&
    screenPointY < rectScreenY + rectScreenH
  )
}

export let isPointInRect = ( canvas: HTMLCanvasElement, pointX: number, pointY: number, rectX: number, rectY: number, rectW: number, rectH: number ): boolean => {
  return (
    pointX > canvas.width / 2 + rectX &&
    pointX < canvas.width / 2 + rectX + rectW &&
    pointY > canvas.height / 2 + rectY &&
    pointY < canvas.height / 2 + rectY + rectH
  )
}