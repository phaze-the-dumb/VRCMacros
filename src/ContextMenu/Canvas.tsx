import { invoke } from "@tauri-apps/api/core";
import { PositionInfo } from "../renderer";
import { Node, NodeType } from "../structs/node";
import { OSCMessage } from "../structs/OscMessage";
import { screenToWorldSpace } from "../utils/interections";
import { NodeManager } from "../Mangers/NodeManager";
import { ContextMenuItem } from "../structs/ContextMenu";

export let CanvasContextMenu: ContextMenuItem[] = [
  {
    text: "Add OSC Trigger Node",
    clicked: ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
      let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);

      let node: Node = {
        name: 'OSC Trigger',
        id: NodeManager.Instance.GetNewNodeId(),
        x: pos[0],
        y: pos[1],
        w: 200,
        h: 50,
        inputs: [],
        outputs: [],
        selected: false,
        statics: [
          {
            name: "OSC Trigger",
            type: NodeType.OSCAddress,
            value: null
          },
          {
            name: "Parameter List",
            type: NodeType.ParameterList,
            value: []
          }
        ],
        onStaticsUpdate: ( node ) => {
          let address = node.statics[0].value;
          let parameters = node.statics[1].value;

          (async () => {
            if(address){
              let addresses = await invoke<OSCMessage[]>('get_addresses');
              let msgDat = addresses.find(x => x.address == address);

              if(!msgDat)return;

              parameters = msgDat.values.map(x => { return { type: x.key, desc: '' }});
              node.statics[1].value = parameters;
            }

            node.outputs.map(output => {
              output.connections.map(partner => {
                partner.connections = partner.connections.filter(x => x != output);
              })
            })
            node.outputs = [];

            node.outputs.push({
              name: 'Flow',
              type: NodeType.Flow,
              connections: [],
              parent: node,
              index: 0
            })

            parameters.forEach(( dat: any, indx: number ) => {
              let type: NodeType | null = null;

              switch(dat.type){
                case 'Int':
                  type = NodeType.Int;
                  break;
                case 'Float':
                  type = NodeType.Float;
                  break;
                case 'String':
                  type = NodeType.String;
                  break;
                case 'Boolean':
                  type = NodeType.Boolean;
                  break;
              }

              if(type){
                node.outputs.push({
                  name: dat.desc === '' ? dat.type : dat.desc,
                  type: type,
                  connections: [],
                  parent: node,
                  index: indx + 1
                })
              }
            });

            node.h = 60 + (parameters.length + 1) * 30;
            NodeManager.Instance.UpdateConfig();
          })();
        }
      };

      NodeManager.Instance.AddNode(node);
    },
    hovered: false
  },

  {
    text: "Conditional",
    menu: {
      items: [
        {
          text: "If Equals",
          hovered: false,
          clicked: ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
            let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);

            let node: Node = {
              name: 'If Equals',
              id: NodeManager.Instance.GetNewNodeId(),
              x: pos[0],
              y: pos[1],
              w: 220,
              h: 150,
              inputs: [],
              outputs: [],
              selected: false,
              statics: [],
              onStaticsUpdate: ( _node ) => {}
            };

            node.inputs.push({
              name: "Flow",
              type: NodeType.Flow,
              connections: [],
              parent: node,
              index: 0
            });

            node.inputs.push({
              name: "Input 1",
              type: NodeType.AnyTypeA,
              connections: [],
              parent: node,
              index: 1
            });

            node.inputs.push({
              name: "Input 2",
              type: NodeType.AnyTypeA,
              connections: [],
              parent: node,
              index: 2
            });


            node.outputs.push({
              name: "Equal",
              type: NodeType.Flow,
              connections: [],
              parent: node,
              index: 0
            });

            node.outputs.push({
              name: "Not Equal",
              type: NodeType.Flow,
              connections: [],
              parent: node,
              index: 1
            });

            NodeManager.Instance.AddNode(node);
          }
        },
      ],
      position: [ 0, 0 ],
      size: [ 0, 0 ],
      visible: true
    },
    hovered: false
  },

  {
    text: "Statics",
    menu: {
      items: [
        {
          text: "String",
          hovered: false,
          clicked: ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
            let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);

            let node: Node = {
              name: 'String',
              id: NodeManager.Instance.GetNewNodeId(),
              x: pos[0],
              y: pos[1],
              w: 200,
              h: 85,
              inputs: [],
              outputs: [],
              selected: false,
              statics: [],
              onStaticsUpdate: ( _node ) => {}
            };

            node.outputs.push({
              name: "String",
              type: NodeType.String,
              connections: [],
              parent: node,
              index: 0
            });

            NodeManager.Instance.AddNode(node);
          }
        },

        {
          text: "Int",
          hovered: false,
          clicked: ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
            let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);

            let node: Node = {
              name: 'Int',
              id: NodeManager.Instance.GetNewNodeId(),
              x: pos[0],
              y: pos[1],
              w: 200,
              h: 85,
              inputs: [],
              outputs: [],
              selected: false,
              statics: [],
              onStaticsUpdate: ( _node ) => {}
            };

            node.outputs.push({
              name: "Int",
              type: NodeType.Int,
              connections: [],
              parent: node,
              index: 0
            });

            NodeManager.Instance.AddNode(node);
          }
        },
      ],
      position: [ 0, 0 ],
      size: [ 0, 0 ],
      visible: true
    },
    hovered: false
  },

  {
    text: "OSC Actions",
    menu: {
      items: [
        {
          text: "Send Chatbox",
          hovered: false,
          clicked: ( e: MouseEvent, canvas: HTMLCanvasElement, position: PositionInfo ) => {
            let pos = screenToWorldSpace(canvas, position, e.clientX, e.clientY);

            let node: Node = {
              name: 'Send Chatbox',
              id: NodeManager.Instance.GetNewNodeId(),
              x: pos[0],
              y: pos[1],
              w: 200,
              h: 120,
              inputs: [],
              outputs: [],
              selected: false,
              statics: [],
              onStaticsUpdate: ( _node ) => {}
            };

            node.inputs.push({
              name: "Flow",
              type: NodeType.Flow,
              connections: [],
              parent: node,
              index: 0
            });

            node.inputs.push({
              name: "Value",
              type: NodeType.String,
              connections: [],
              parent: node,
              index: 1
            });

            NodeManager.Instance.AddNode(node);
          }
        },
      ],
      position: [ 0, 0 ],
      size: [ 0, 0 ],
      visible: true
    },
    hovered: false
  },
]