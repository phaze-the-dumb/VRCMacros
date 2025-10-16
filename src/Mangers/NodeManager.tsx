import { invoke } from "@tauri-apps/api/core";
import { Node } from "../structs/node";

export class NodeManager{
  public static Instance: NodeManager;

  private _nodes: Node[] = [];
  private _newestNodeId = 0;
  private _needsSave = false;

  constructor(){
    NodeManager.Instance = this;

    setInterval(() => {
      // Save config every 1 second
      if(this._needsSave)this._saveConfigToDisk();
    }, 1_000);
  }

  public AddNode( node: Node ){
    this._nodes.push(node);
    this.UpdateConfig();
  }

  public RemoveNode( node: Node ){
    this._nodes = this._nodes.filter(x => x !== node);
    this.UpdateConfig();
  }

  public GetNodes(): Node[]{
    return this._nodes;
  }

  public GetNewNodeId(){
    return this._newestNodeId++; // TODO: really need a better solution than this, but it'll work for now
  }

  public UpdateConfig(){
    this._needsSave = true;
  }

  private _loadFromConfig( config: string ){
    let json = JSON.parse(config);

    this._nodes = [];

    // Populate nodes
    for (let i = 0; i < json.length; i++) {
      let node = json[i];

      this._nodes.push({
        name: node.name,
        id: node.id,
        x: node.x, y: node.y,
        w: node.w, h: node.h,
        inputs: [],
        outputs: [],
        selected: false,
        statics: node.statics,
        onStaticsUpdate: ( _node ) => {} // TODO: Make a seperate setup for node logic so we can load from that
      })

      this._newestNodeId = node.id
    }

    // Populate node outputs
    for (let i = 0; i < json.length; i++) {
      let configNode = json[i];
      let node = this._nodes[i];

      for (let j = 0; j < configNode.outputs.length; j++) {
        let output = configNode.outputs[j];
        node.outputs.push({
          name: output.name,
          type: output.type,
          connections: [],
          parent: node,
          index: j
        })
      }
    }

    // Populate node inputs
    for (let i = 0; i < json.length; i++) {
      let configNode = json[i];
      let outputParentNode = this._nodes[i];

      for (let j = 0; j < configNode.outputs.length; j++) {
        let output = configNode.outputs[j];

        for (let k = 0; k < output.connections.length; k++) {
          let input = output.connections[k];
          let node = this._nodes[input.node];

          let realInput = node.inputs.find(x => x.index === input.index);
          let realOutput = outputParentNode.outputs[j];

          if(realInput){
            realInput.connections.push(realOutput);
          } else{
            node.inputs.push({
              name: input.name,
              type: input.type,
              parent: node,
              connections: [ realOutput ],
              index: input.index
            })
          }
        }
      }
    }
  }

  private _saveConfigToDisk(){
    this._needsSave = false;
    // Convert it into a structure we can actually save...

    let nodesToSave = [];

    for (let i = 0; i < this._nodes.length; i++) {
      let node = this._nodes[i];

      let nodeOutputs = [];

      for (let j = 0; j < node.outputs.length; j++) {
        let output = node.outputs[j];

        nodeOutputs.push({
          name: output.name,
          type: output.type,
          connections: output.connections.map(x => { return {
            name: x.name,
            node: x.parent.id,
            index: x.index,
            type: x.type
          }})
        })
      }

      nodesToSave.push({
        name: node.name,
        id: node.id,
        x: node.x, y: node.y,
        w: node.w, h: node.h,
        statics: node.statics,
        outputs: nodeOutputs
      })
    }

    invoke('save_graph', { graph: JSON.stringify(nodesToSave) });
  }
}