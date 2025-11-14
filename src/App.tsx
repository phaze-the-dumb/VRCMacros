import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import "./App.css";
import { renderBackgroundGrid, renderContextMenu, renderNodes, renderNullTab, renderTempDrawing } from "./renderer";
import { lerp } from "./utils/lerp";
import { Node, NodeIO, NodeIOCanCast, NodeIOResolveAnyTypes } from "./structs/node";
import { isPointInRect, isPointInRectApplyOffset, screenToWorldSpace } from "./utils/interections";
import { ControlBar } from "./components/ControlBar";
import { CanvasContextMenu } from "./ContextMenu/Canvas";
import { NodeContextMenu } from "./ContextMenu/Node";
import { ContextMenu } from "./structs/ContextMenu";
import { NodeManager } from "./Mangers/NodeManager";
import { TabMenu } from "./components/TabMenu";
import { ConfirmationPopup } from "./components/ConfirmationPopup";

import * as keybinds from './keybinds';
import { listen } from "@tauri-apps/api/event";

let App = () => {
  let [ selectedNodes, setSelectedNodes ] = createSignal<Node[]>([], { equals: false });
  let [ mousePos, setMousePos ] = createSignal<[ number, number ]>([ 0, 0 ]);

  let canvas!: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let stopRender = false;

  let scale = 0.25;
  let targetScale = 1;

  let offset = [ 0, 0 ];
  let offsetTarget = [ 0, 0 ];

  let movingNode: Node | null = null;

  let isDrawing = false;
  let drawingFrom: NodeIO | null = null;
  let drawingTo: [ number, number ] = [ 0, 0 ];

  let lockMovement = false;

  {
    let loadedScale = localStorage.getItem('scale');
    if(loadedScale)targetScale = parseFloat(loadedScale);

    let loadedOffsetX = localStorage.getItem('offsetX');
    if(loadedOffsetX)offsetTarget[0] = parseFloat(loadedOffsetX);

    let loadedOffsetY = localStorage.getItem('offsetY');
    if(loadedOffsetY)offsetTarget[1] = parseFloat(loadedOffsetY);
  };

  let screenMoved = false;

  let contextMenu: ContextMenu = {
    items: [],
    position: [ 0, 0 ],
    size: [ 0, 0 ],
    visible: false
  }

  createEffect(() => {
    let snodes = selectedNodes();

    let anodes = NodeManager.Instance.GetNodes();
    if(!anodes)return;

    for(let node of anodes)node.selected = false;
    for(let node of snodes)node.selected = true;
  })

  onMount(async () => {
    NodeManager.Instance.HookTabChange(() => setSelectedNodes([]));

    ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2);

    window.onresize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
    }

    canvas.onwheel = ( e ) => {
      targetScale += e.deltaY * -(Math.sqrt(targetScale) * 0.001);

      if(targetScale < 0.25)targetScale = 0.25
      else if(targetScale > 5)targetScale = 5;

      screenMoved = true;
    }

    canvas.oncontextmenu = ( e ) => {
      e.preventDefault();

      let clickedNode: Node | null = null
      let nodes = NodeManager.Instance.GetNodes();

      if(nodes){
        nodes.map(node => {
          if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
            e.clientX, e.clientY,
            node.x, node.y, node.w, node.h
          )){
            clickedNode = node;
            return;
          }
        })
      }

      if(clickedNode){
        contextMenu.items = NodeContextMenu(clickedNode, selectedNodes, setSelectedNodes);
      } else{
        contextMenu.items = CanvasContextMenu;
      }

      contextMenu.position = [ e.clientX - 10 - canvas.width / 2, e.clientY - 10 - canvas.height / 2 ];
      contextMenu.visible = true;
    }

    let isShiftClick = false;
    canvas.onmousedown = ( e ) => {
      isShiftClick = e.shiftKey;

      if(
        e.clientY < 60 ||
        e.clientX < 220 ||
        lockMovement
      )return;

      if(e.button !== 0){
        contextMenu.visible = false;
        return;
      }

      if(contextMenu.visible){
        let submenus: ContextMenu[] = [];
        contextMenu.items.map(x => x.menu ? submenus.push(x.menu): null);

        submenus.map(x => {
          if(!x.visible)return;
          if(isPointInRect(canvas, e.clientX, e.clientY,
            x.position[0], x.position[1],
            x.size[0], x.size[1]
          )){
            let item = x.items.filter(x => x.hovered)[0];
            if(item && item.clicked)item.clicked(e, canvas, { x: offset[0], y: offset[1], scale });
          }
        });

        if(isPointInRect(canvas, e.clientX, e.clientY,
          contextMenu.position[0], contextMenu.position[1],
          contextMenu.size[0], contextMenu.size[1]
        )){
          let item = contextMenu.items.filter(x => x.hovered)[0];
          if(item && item.clicked)item.clicked(e, canvas, { x: offset[0], y: offset[1], scale });
        }
      }

      contextMenu.visible = false;

      let clickedNode: any = null;
      isDrawing = false;

      let clickedInput: any = null;
      let nodes = NodeManager.Instance.GetNodes();

      if(nodes){
        nodes.map(node => {
          if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
            e.clientX, e.clientY,
            node.x - 20, node.y, node.w + 40, node.h
          )){
            node.outputs.map(( output, i ) => {
              if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
                e.clientX, e.clientY,
                node.x + (node.w - 10),
                node.y + 50 + (30 * i),
                20, 20
              )){
                output.index = i;

                drawingTo = [
                  node.x + (node.w - 10),
                  node.y + 50 + (30 * i)
                ];
                drawingFrom = output;

                isDrawing = true;
                return;
              }
            })

            node.inputs.map(( input, i ) => {
              if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
                e.clientX, e.clientY,
                node.x - 10,
                node.y + 50 + (30 * i),
                20, 20
              )){
                clickedInput = input;
              }
            })

            clickedNode = node;
            return;
          }
        })
      }

      if(clickedInput){
        let partner = clickedInput.connections.pop();
        if(!partner)return;

        partner.connections = partner.connections.filter(( x: any ) => x !== clickedInput);

        isDrawing = true;
        isMouseDown = true;

        drawingFrom = partner;
        drawingTo = screenToWorldSpace(canvas, { x: offset[0], y: offset[1], scale }, e.clientX - 10 * scale, e.clientY - 10 * scale) as [ number, number ];;

        return;
      }

      movingNode = clickedNode;

      isMouseDown = true;
      mouseStartPos = [ e.clientX, e.clientY ];
      mouseMovePos = [ e.clientX, e.clientY ];
    }

    canvas.onmousemove = ( e ) => {
      setMousePos([ e.clientX, e.clientY ]);

      if(e.shiftKey && isMouseDown){
        let nodes = NodeManager.Instance.GetNodes();
        let hoveredNode: Node | null = null;

        if(nodes){
          nodes.map(node => {
            if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
              e.clientX, e.clientY,
              node.x - 20, node.y, node.w + 40, node.h
            )){
              hoveredNode = node;
              return;
            }
          })
        }

        if(hoveredNode !== null){
          let snodes = selectedNodes();
          if(!snodes.find(x => x.id === hoveredNode!.id)){
            snodes.push(hoveredNode);

            // @ts-ignore
            hoveredNode.x = Math.round(hoveredNode.x / 10) * 10;
            // @ts-ignore
            hoveredNode.y = Math.round(hoveredNode.y / 10) * 10;

            setSelectedNodes(snodes);
          }
        }

        return;
      } else if(isShiftClick)return;

      if(isMouseDown){
        if(isDrawing){
          drawingTo = screenToWorldSpace(canvas, { x: offset[0], y: offset[1], scale }, e.clientX - 10 * scale, e.clientY - 10 * scale) as [ number, number ];
        } else if(movingNode){
          let nodes = selectedNodes();

          for(let node of nodes){
            node.x = node.x - (mouseMovePos[0] - e.clientX) / scale;
            node.y = node.y - (mouseMovePos[1] - e.clientY) / scale;
          }

          mouseMovePos = [ e.clientX, e.clientY ];
          NodeManager.Instance.UpdateConfig();
        } else{
          offsetTarget = [ offsetTarget[0] - (mouseMovePos[0] - e.clientX) / scale, offsetTarget[1] - (mouseMovePos[1] - e.clientY) / scale ];
          mouseMovePos = [ e.clientX, e.clientY ];

          screenMoved = true;
        }
      }

      // TODO: Fix this shit lmao please
      if(contextMenu.visible){
        let submenus: ContextMenu[] = [];
        contextMenu.items.map(x => x.menu ? submenus.push(x.menu): null);

        submenus.map(x => {
          if(!x.visible)return;
          if(isPointInRect(canvas, e.clientX, e.clientY,
            x.position[0], x.position[1],
            x.size[0], x.size[1]
          )){
            x.items.map((y, i) => {
              y.hovered = isPointInRect(canvas, e.clientX, e.clientY,
                x.position[0], x.position[1] + 10 + 25 * i,
                x.size[0], 25
              )
            });
          }
        });

        if(isPointInRect(canvas, e.clientX, e.clientY,
          contextMenu.position[0], contextMenu.position[1],
          contextMenu.size[0], contextMenu.size[1]
        )){
          contextMenu.items.map((x, i) => {
            x.hovered = isPointInRect(canvas, e.clientX, e.clientY,
              contextMenu.position[0], contextMenu.position[1] + 10 + 25 * i,
              contextMenu.size[0], 25
            )

            if(x.menu)x.menu.visible = x.hovered;
          });
        }
      }
    }

    canvas.onmouseup = ( e ) => {
      let nodes = NodeManager.Instance.GetNodes();
      let clickedNode;

      if(nodes){
        nodes.map(node => {
          if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
            e.clientX, e.clientY,
            node.x - 20, node.y, node.w + 40, node.h
          )){
            clickedNode = node;

            node.inputs.map(( input, i ) => {
              if(isPointInRectApplyOffset(canvas, { x: offset[0], y: offset[1], scale },
                e.clientX, e.clientY,
                node.x - 10,
                node.y + 50 + (30 * i),
                20, 20
              )){
                if(isDrawing){
                  let fromType = NodeIOResolveAnyTypes(drawingFrom!);
                  let toType = NodeIOResolveAnyTypes(input);

                  if(
                    drawingFrom!.connections.indexOf(input) === -1 &&
                    (
                      toType === null ||
                      NodeIOCanCast(fromType, toType)
                    )
                  ){
                    drawingFrom!.connections.push(input);
                    input.connections.push(drawingFrom!);

                    NodeManager.Instance.UpdateConfig();
                  }
                }
              }
            })
          }
        })
      }

      let diffX = mouseStartPos[0] - e.clientX;
      let diffY = mouseStartPos[1] - e.clientY;

      let dist = Math.sqrt(diffX * diffX + diffY * diffY);

      if(dist < 10){
        if(clickedNode){
          if(e.shiftKey){
            let snodes = selectedNodes();
            if(snodes.indexOf(clickedNode) === -1)snodes.push(clickedNode);

            // @ts-ignore
            clickedNode.x = Math.round(clickedNode.x / 10) * 10;
            // @ts-ignore
            clickedNode.y = Math.round(clickedNode.y / 10) * 10;

            setSelectedNodes(snodes);
          } else{
            // @ts-ignore
            clickedNode.x = Math.round(clickedNode.x / 10) * 10;
            // @ts-ignore
            clickedNode.y = Math.round(clickedNode.y / 10) * 10;

            setSelectedNodes([ clickedNode ]);
          }
        } else {
          setSelectedNodes([]);
        }
      }

      isDrawing = false;
      isMouseDown = false;
    }

    keybinds.load(mousePos, selectedNodes, setSelectedNodes);
    requestAnimationFrame(update);

    let unlisten_0 = await listen('hide-window', () => {
      stopRender = true;
    })

    let unlisten_1 = await listen('show-window', () => {
      if(stopRender)window.location.reload();
    })

    onCleanup(() => {
      stopRender = true;
      window.clearInterval(interval);

      unlisten_0();
      unlisten_1();
    });
  });

  let update = () => {
    if(stopRender)return;
    scale = lerp(scale, targetScale, 0.25);

    offset[0] = lerp(offset[0], offsetTarget[0], 0.5);
    offset[1] = lerp(offset[1], offsetTarget[1], 0.5);

    ctx.clearRect(canvas.width / -2, canvas.height / -2, canvas.width, canvas.height);

    let nodes = NodeManager.Instance.GetNodes();

    renderBackgroundGrid(canvas, ctx, { x: offset[0], y: offset[1], scale });

    if(nodes)
      renderNodes(canvas, ctx, nodes, { x: offset[0], y: offset[1], scale });
    else
      renderNullTab(canvas, ctx);

    if(isDrawing)renderTempDrawing(canvas, ctx, drawingTo, drawingFrom!, { x: offset[0], y: offset[1], scale });
    renderContextMenu(ctx, contextMenu);

    requestAnimationFrame(update);
  }

  let isMouseDown = false;
  let mouseStartPos = [ 0, 0 ];
  let mouseMovePos = [ 0, 0 ];

  let interval = setInterval(() => {
    if(screenMoved){
      localStorage.setItem('scale', targetScale.toFixed(4));
      localStorage.setItem('offsetX', offset[0].toFixed(4));
      localStorage.setItem('offsetY', offset[1].toFixed(4));
    }
  }, 1000);

  return (
    <>
      <ConfirmationPopup />
      <TabMenu />
      <ControlBar node={selectedNodes} lockMovement={( lock ) => lockMovement = lock} />
      <canvas ref={canvas}/>
    </>
  );
}

export default App;
