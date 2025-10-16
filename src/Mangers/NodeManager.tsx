import { Node } from "../structs/node";

export class NodeManager{
  public static Instance: NodeManager;

  private _nodes: Node[] = [];

  constructor(){
    NodeManager.Instance = this;
  }

  public AddNode( node: Node ){
    this._nodes.push(node);
  }

  public RemoveNode( node: Node ){
    this._nodes = this._nodes.filter(x => x !== node);
  }

  public GetNodes(): Node[]{
    return this._nodes;
  }
}