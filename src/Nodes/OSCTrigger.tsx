import { invoke } from "@tauri-apps/api/core";
import { Node, NodeType } from "../structs/node";
import { OSCMessage } from "../structs/OscMessage";
import { NodeManager } from "../Mangers/NodeManager";
import { NodeDefinition } from "./Nodes";

export let NodeOSCTrigger: NodeDefinition = {
  os: 'any',

  isSingle: true,
  name: 'OSC Trigger',
  typeId: 'osctrigger',

  w: 200,
  h: 50,

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

  onStaticsUpdate: async ( node: Node ) => {
    let address = node.statics[0].value;
    let parameters = node.statics[1].value;

    if(address){
      let addresses = await invoke<OSCMessage[]>('get_addresses');
      let msgDat = addresses.find(x => x.address == address);

      if(msgDat){
        parameters = msgDat.values.map(x => { return { type: x.key, desc: '' }});
        node.statics[1].value = parameters;
      }
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
  }
};