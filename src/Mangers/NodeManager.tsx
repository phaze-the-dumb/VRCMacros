import { invoke } from "@tauri-apps/api/core";
import { Node } from "../structs/node";
import { Tab } from "../structs/Tab";
import { createSignal } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { getVersion } from "@tauri-apps/api/app";
import { NodesByID } from "../Nodes/Nodes";
import { save } from "@tauri-apps/plugin-dialog";

export interface TabHashMap {
  [details: string] : Tab;
}

export class NodeManager{
  public static Instance: NodeManager;

  private _selectedTab: string | null = null;
  private _tabs: TabHashMap = {};

  private _nodes: Node[] = [];

  constructor(){
    NodeManager.Instance = this;

    listen('load_new_tab', ( ev: any ) => {
      this._loadFromConfig(ev.payload);
    })
  }


  private _tabUpdateHook: ( tabs: TabHashMap ) => void = () => {};
  private _tabChangeHook: () => void = () => {};

  public async AddTab( name: string ){
    let [ selected, setSelected ] = createSignal(false);
    let [ needsSave, setNeedsSave ] = createSignal(false);

    let tab: Tab = {
      name: name,
      id: await NodeManager.Instance.GetNewNodeId(),
      nodes: [],

      selected,
      setSelected,

      needsSave,
      setNeedsSave
    };

    this._tabs[tab.id] = tab;

    this.SelectTab(tab.id);
    this._tabUpdateHook(this._tabs);
  }

  public CloseTab( id: string ){ // TODO: Add confirmation to close tab
    console.log(id === this._selectedTab);
    if(this._selectedTab === id){
      let tabs = Object.values(this._tabs);

      if(tabs.length === 1){
        this.SelectTab(null);
      } else{
        let tabToDelete = this._tabs[id];

        let index = tabs.indexOf(tabToDelete);
        let nextTab = tabs[index + 1];

        if(nextTab)
          this.SelectTab(nextTab.id);
        else
          this.SelectTab(tabs[0].id);
      }
    }

    delete this._tabs[id];
    this._tabUpdateHook(this._tabs);
  }

  public RenameTab( id: string, name: string ){
    let tab = this._tabs[id];
    if(!tab)return;

    tab.name = name;
    this._tabUpdateHook(this._tabs);
  }

  public SelectTab( id: string | null ){
    if(this._selectedTab && this._tabs[this._selectedTab]){
      let tab = this._tabs[this._selectedTab];

      tab.setSelected(false);
      tab.nodes = this._nodes;
    }

    this._selectedTab = id;
    this._tabChangeHook();

    if(this._selectedTab){
      let tab = this._tabs[this._selectedTab];
      if(!tab){
        this._selectedTab = null;
        return this._nodes = [];
      }

      tab.setSelected(true);
      this._nodes = tab.nodes;
    } else{
      this._nodes = [];
    }
  }

  public async SaveTab( tab: Tab ){
    let path = await save({ defaultPath: tab.name + '.macro', filters: [ { name: 'Macro Files', extensions: [ 'macro' ] } ] });

    console.log(path);

    // TODO: Add location metadata to tab interface so it knows where to save
    // TODO: store file
  }

  public HookTabUpdate( cb: ( tabs: TabHashMap ) => void ){
    this._tabUpdateHook = cb;
  }

  public HookTabChange( cb: () => void ){
    this._tabChangeHook = cb;
  }


  public AddNode( node: Node ){
    if(!this._selectedTab)return;

    this._nodes.push(node);
    this.UpdateConfig();
  }

  public RemoveNode( node: Node ){
    if(!this._selectedTab)return;

    this._nodes = this._nodes.filter(x => x !== node);
    this.UpdateConfig();
  }

  public GetNodes(): Node[] | null{
    if(this._selectedTab)
      return this._nodes;
    else
      return null;
  }

  public async GetNewNodeId(){
    let encoder = new TextEncoder();
    let data = encoder.encode(Date.now().toString() + Math.random().toString());
    let hash = await window.crypto.subtle.digest("SHA-256", data); // Probably should get a better ID implementation

    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  }


  public UpdateConfig(){
    if(!this._selectedTab)return;
    let tab = this._tabs[this._selectedTab];
    if(!tab)return;

    tab.setNeedsSave(true);
  }

  private async _loadFromConfig( config: string ){
    let json = JSON.parse(config);

    if(
      !json.tab_name ||
      !json.version ||
      !json.graph
    )return;

    await this.AddTab(json.tab_name);
    this._nodes = [];

    let graph = json.graph;

    // Populate nodes
    for (let i = 0; i < graph.length; i++) {
      let node = graph[i];

      let nod = new Node(node.pos, NodesByID[node.typeId], node.id);

      nod.statics = node.statics;
      nod.onStaticsUpdate(nod);

      this._nodes.push(nod);
    }

    // Populate node inputs
    for (let i = 0; i < graph.length; i++) {
      let configNode = graph[i];
      let outputParentNode = this._nodes[i];

      for (let j = 0; j < configNode.outputs.length; j++) {
        let output = configNode.outputs[j];

        for (let k = 0; k < output.connections.length; k++) {
          let input = output.connections[k];
          let node = this._nodes.find(x => x.id === input.node)!;

          let realInput = node.inputs.find(x => x.index === input.index);
          let realOutput = outputParentNode.outputs[j];

          if(realInput){
            realInput.connections.push(realOutput);
            realOutput.connections.push(realInput);
          } else{
            let realInput = {
              name: input.name,
              type: input.type,
              parent: node,
              connections: [ realOutput ],
              index: input.index
            };

            node.inputs.push(realInput);
            realOutput.connections.push(realInput);
          }
        }
      }
    }
  }

  private async _saveConfigToDisk(){
    // Convert it into a structure we can actually save...

    if(!this._selectedTab)return;
    let tab = this._tabs[this._selectedTab];
    if(!tab)return;

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
        typeId: node.typeId,
        pos: [ node.x, node.y ],
        outputs: nodeOutputs,
        statics: node.statics
      })
    }

    invoke('save_graph', { tabName: tab.name, graph: JSON.stringify({
      tab_name: tab.name,
      version: await getVersion(),
      graph: nodesToSave
    }) });
  }
}