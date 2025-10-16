import { ContextMenu } from "./structs/ContextMenu";
import { Node, NodeIO, NodeIOLinkColours } from "./structs/node";
import { lerp } from "./utils/lerp";

export interface PositionInfo{
  x: number,
  y: number,
  scale: number
}

const GRID_SIZE = 50;

export let renderBackgroundGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  position: PositionInfo
) => {
  let offsetX = position.x % 50;
  let offsetY = position.y % 50;

  let gridAmountX = canvas.width / (GRID_SIZE * position.scale);
  let gridAmountY = canvas.height / (GRID_SIZE * position.scale);

  ctx.fillStyle = '#fff1';

  for (let x = 0; x < gridAmountX / 2; x++) {
    for (let y = 0; y < gridAmountY / 2; y++) {
      ctx.fillRect(
        ((x * GRID_SIZE) + offsetX) * position.scale,
        ((y * GRID_SIZE) + offsetY) * position.scale,
        5 * position.scale, 5 * position.scale);

      ctx.fillRect(
        (((x + 1) * GRID_SIZE) - offsetX) * -position.scale,
        ((y * GRID_SIZE) + offsetY) * position.scale,
        5 * position.scale, 5 * position.scale);

      ctx.fillRect(
        ((x * GRID_SIZE) + offsetX) * position.scale,
        (((y + 1) * GRID_SIZE) - offsetY) * -position.scale,
        5 * position.scale, 5 * position.scale);

      ctx.fillRect(
        (((x + 1) * GRID_SIZE) - offsetX) * -position.scale,
        (((y + 1) * GRID_SIZE) - offsetY) * -position.scale,
        5 * position.scale, 5 * position.scale);
    }
  }
}

export let renderNodes = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  position: PositionInfo
) => {
  let startX = canvas.width / -2;
  let startY = canvas.height / -2;

  ctx.textBaseline = 'top';

  nodes.map(node => {
    ctx.fillStyle = '#1f2129';
    ctx.strokeStyle = node.selected ? '#004696ff' : '#fff5';
    ctx.lineWidth = 5 * position.scale;

    // Draw Node Box
    drawRoundedRect(ctx,
      (node.x + startX + position.x) * position.scale,
      (node.y + startY + position.y) * position.scale,
      node.w * position.scale,
      node.h * position.scale,
      10 * position.scale);

    ctx.stroke();
    ctx.fill();

    // Draw Node Name
    ctx.fillStyle = '#fff';
    ctx.font = (25 * position.scale) + 'px Comic Mono';
    ctx.textAlign = 'center';

    ctx.fillText(node.name,
      (node.x + (node.w * 0.5) + startX + position.x) * position.scale,
      (node.y + 10 + startY + position.y) * position.scale
    );

    // Draw Inputs
    ctx.font = (15 * position.scale) + 'px Comic Mono';
    ctx.textAlign = 'left';

    node.inputs.map(( input, i ) => {
      ctx.fillStyle = NodeIOLinkColours(input);
      ctx.fillRect(
        (node.x + 10 + startX + position.x) * position.scale,
        (node.y + 50 + (30 * i) + startY + position.y) * position.scale,
        20 * position.scale, 20 * position.scale
      )

      ctx.fillText(input.name,
        (node.x + 35 + startX + position.x) * position.scale,
        (node.y + 53 + (30 * i) + startY + position.y) * position.scale,
      )
    })

    // Draw Outputs
    ctx.textAlign = 'right';

    node.outputs.map(( output, i ) => {
      ctx.fillStyle = NodeIOLinkColours(output);
      ctx.fillRect(
        (node.x + (node.w - 30) + startX + position.x) * position.scale,
        (node.y + 50 + (30 * i) + startY + position.y) * position.scale,
        20 * position.scale, 20 * position.scale
      )

      ctx.fillText(output.name,
        (node.x + (node.w - 35) + startX + position.x) * position.scale,
        (node.y + 53 + (30 * i) + startY + position.y) * position.scale,
      )
    })
  })

  nodes.map(node => {
    node.outputs.map(( output, i ) => {
      output.connections.map(partner => {
        ctx.strokeStyle = NodeIOLinkColours(output);
        drawCurve(ctx,
          (node.x + (node.w - 30) + 10 + startX + position.x) * position.scale,
          (node.y + 50 + (30 * i) + 10 + startY + position.y) * position.scale,
          (partner.parent.x + 20 + startX + position.x) * position.scale,
          (partner.parent.y + 60 + (30 * partner.index) + startY + position.y) * position.scale,
        );
        ctx.stroke();
      })
    })
  })
}

export let renderContextMenu = (
  ctx: CanvasRenderingContext2D,
  contextMenu: ContextMenu
) => {
  if(contextMenu.visible){
    ctx.font = '20px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    let widestItem = 0;
    contextMenu.items.map(x => {
      let width = ctx.measureText(x.text).width;
      if(widestItem < width)widestItem = width;
    });

    contextMenu.size = [ widestItem + 20, 25 * contextMenu.items.length + 20 ]

    drawRoundedRect(ctx, contextMenu.position[0], contextMenu.position[1], contextMenu.size[0], contextMenu.size[1], 10);
    ctx.fillStyle = '#444';
    ctx.fill();

    let submenuToRender: any = null;

    contextMenu.items.map((x, i) => {
      ctx.fillStyle = x.hovered ? '#aaa' : '#fff';
      ctx.fillText(x.text, contextMenu.position[0] + 10, contextMenu.position[1] + 10 + 25 * i);

      if(x.hovered && x.menu){
        submenuToRender = x.menu;
        submenuToRender.position = [ contextMenu.position[0] + contextMenu.size[0] + 5, contextMenu.position[1] + 25 * i ];
      }
    });

    if(submenuToRender){
      renderContextMenu(ctx, submenuToRender);
    }
  }
}

export let renderTempDrawing = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  drawingTo: [ number, number ],
  drawingFrom: NodeIO,
  position: PositionInfo
) => {
  let startX = canvas.width / -2;
  let startY = canvas.height / -2;

  ctx.fillStyle = '#f00';

  ctx.fillRect(
    (drawingTo[0] + 10 + startX + position.x) * position.scale,
    (drawingTo[1] + 10 + startY + position.y) * position.scale,
    10, 10
  );

  ctx.fillRect(
    (drawingFrom.parent.x + (drawingFrom.parent.w - 30) + 10 + startX + position.x) * position.scale,
    (drawingFrom.parent.y + 50 + (30 * drawingFrom.index) + 10 + startY + position.y) * position.scale,
    10, 10
  );

  ctx.strokeStyle = NodeIOLinkColours(drawingFrom);
  drawCurve(ctx,
    (drawingFrom.parent.x + (drawingFrom.parent.w - 30) + 10 + startX + position.x) * position.scale,
    (drawingFrom.parent.y + 50 + (30 * drawingFrom.index) + 10 + startY + position.y) * position.scale,
    (drawingTo[0] + 10 + startX + position.x) * position.scale,
    (drawingTo[1] + 10 + startY + position.y) * position.scale,
  );
  ctx.stroke();
}

let drawCurve = ( ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number ) => {
  ctx.beginPath();

  let bias = Math.sqrt(( fromX - toX ) * ( fromX - toX ) + ( fromY - toY ) * ( fromY - toY )) / 3;

  let start = [ fromX + bias, fromY ];
  let end = [ toX - bias, toY ];

  let midpoint = [
    lerp(start[0], end[0], 0.5),
    lerp(start[1], end[1], 0.5)
  ];

  ctx.bezierCurveTo(fromX, fromY, start[0], start[1], midpoint[0], midpoint[1]);
  ctx.bezierCurveTo(midpoint[0], midpoint[1], end[0], end[1], toX, toY);
}

let drawRoundedRect = ( ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number ) => {
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  ctx.lineTo(x + w - radius, y);
  ctx.arc(x + w - radius, y + radius, radius, Math.PI * 1.5, 0);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI * 0.5);
  ctx.lineTo(x + radius, y + h);
  ctx.arc(x + radius, y + h - radius, radius, Math.PI * 0.5, Math.PI);
  ctx.closePath();
}