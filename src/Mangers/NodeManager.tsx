import { invoke } from "@tauri-apps/api/core";
import { Node } from "../structs/node";
import { Tab } from "../structs/Tab";
import { createSignal } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { getVersion } from "@tauri-apps/api/app";
import { NodesByID } from "../Nodes/Nodes";
import { save } from "@tauri-apps/plugin-dialog";
import { ConfirmationManager } from "./ConfirmationManager";
import { getCurrentWindow } from "@tauri-apps/api/window";

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
      this._loadFromConfig(ev.payload.path, null, ev.payload.graph);
    });

    invoke('load_previous_tabs').then(async ( tabs: any ) => {
      let version = await getVersion();

      for(let tab of Object.entries<any>(tabs)){
        console.log(tab);

        await this._loadFromConfig(tab[1][2], tab[0], JSON.stringify({
          tab_name: tab[1][1],
          version,
          graph: tab[1][0]
        }));
      };
    });

    (async () => {
      let window = await getCurrentWindow();

      window.onCloseRequested(async _ => {
        let tabs = Object.values(this._tabs);
        let tabsNeedingSaving = tabs.filter(x => x.needsSave());

        for(let tab of tabsNeedingSaving){
          await new Promise<void>(res => {
            ConfirmationManager.Instance.ShowConfirmation(
              `Discard Changes in ${tab.name}?`,
              'If you close this tab without saving you will lose all changes.',
              [
                {
                  text: 'Save',
                  callback: async () => {
                    await this.SaveTab(tab);
                    res();
                  }
                },
                {
                  text: 'Don\'t Save',
                  callback: () => { res(); }
                }
              ]
            )
          });
        }
      });
    })();
  }


  private _tabUpdateHook: ( tabs: TabHashMap ) => void = () => {};
  private _tabChangeHook: () => void = () => {};

  public async AddTab( name: string, id: string | null = null ): Promise<Tab>{
    let [ selected, setSelected ] = createSignal(false);
    let [ needsSave, setNeedsSave ] = createSignal(false);

    let tab: Tab = {
      name: name,
      id: id || await NodeManager.Instance.GetNewNodeId(),
      nodes: [],
      saveLocation: null,

      selected,
      setSelected,

      needsSave,
      setNeedsSave,

      refuseSync: false
    };

    this._tabs[tab.id] = tab;

    this.SelectTab(tab.id);
    this._tabUpdateHook(this._tabs);

    return tab;
  }

  public CloseTab( id: string ){
    let tab = this._tabs[id];

    let closeCB = () => {
      if(this._selectedTab === id){
        let tabs = Object.values(this._tabs);

        if(tabs.length === 1){
          this.SelectTab(null);
        } else{
          let index = tabs.indexOf(tab);
          let nextTab = tabs[index + 1];

          if(nextTab)
            this.SelectTab(nextTab.id);
          else
            this.SelectTab(tabs[0].id);
        }
      }

      invoke('discard_tab', { id: id });

      delete this._tabs[id];
      this._tabUpdateHook(this._tabs);
    }

    if(tab.needsSave()){
      ConfirmationManager.Instance.ShowConfirmation(
        'Discard Changes?',
        'If you close this tab without saving you will lose all changes.',
        [
          {
            text: 'Save',
            callback: async () => {
              await this.SaveTab(tab);
              closeCB();
            }
          },
          {
            text: 'Don\'t Save',
            callback: () => {
              closeCB();
            }
          }
        ]
      )
    } else{
      closeCB();
    }
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
    let path =
      tab.saveLocation ||
      await save({ defaultPath: tab.name + '.macro', filters: [ { name: 'Macro Files', extensions: [ 'macro' ] } ] });

    if(!path)throw new Error("Cannot save");

    tab.saveLocation = path;
    tab.setNeedsSave(false);

    this._saveConfigToDisk(path, tab.id);
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


  public UpdateConfig( needsSave = true ){
    if(!this._selectedTab)return;
    let tab = this._tabs[this._selectedTab];
    if(!tab)return;

    if(tab.refuseSync)return;
    invoke('sync_tab', { graph: this._generateTabGraph(tab.id)[0], id: tab.id, name: tab.name, location: tab.saveLocation });

    if(needsSave)tab.setNeedsSave(true);
  }

  private async _loadFromConfig( path: string | null, id: string | null, config: string ){
    let json = JSON.parse(config);

    if(
      !json.tab_name ||
      !json.version ||
      !json.graph
    )return;

    let tab = await this.AddTab(json.tab_name, id);
    tab.refuseSync = true;
    tab.saveLocation = path;

    this._nodes = [];

    let graph = json.graph;

    // Populate nodes
    for (let i = 0; i < graph.length; i++) {
      let node = graph[i];

      let nod = new Node(node.pos, NodesByID[node.typeId], node.id);

      nod.statics = node.statics;
      await nod.onStaticsUpdate(nod);

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

    tab.setNeedsSave(false);
    tab.nodes = this._nodes;

    tab.refuseSync = false;
    this.UpdateConfig(false);
  }

  private _generateTabGraph( tabId: string | null ): [ any, Tab | null ]{
    // Convert it into a structure we can actually save...

    if(!tabId)return [ null, null ];
    let tab = this._tabs[tabId];
    if(!tab)return [ null, null ];

    let nodesToSave = [];

    for (let i = 0; i < tab.nodes.length; i++) {
      let node = tab.nodes[i];

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

    return [ nodesToSave, tab ];
  }

  private async _saveConfigToDisk( path: string, tabId: string | null ){
    let [ nodesToSave, tab ] = this._generateTabGraph(tabId);
    if(!tab)return;

    invoke('save_graph', { graph: JSON.stringify({
      tab_name: tab.name,
      version: await getVersion(),
      graph: nodesToSave
    }), path });
  }
}