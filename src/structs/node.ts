export interface Node{
  name: string,
  id: number,
  x: number,
  y: number,
  w: number,
  h: number,
  inputs: NodeIO[],
  outputs: NodeIO[],
  selected: boolean,
  statics: NodeStatic[],
  onStaticsUpdate: ( node: Node ) => void
}

export interface NodeIO{
  name: string,
  type: NodeType,
  connections: NodeIO[],
  parent: Node,
  index: number
}

export enum NodeType{
  Label = 0,

  String = 1,
  Float = 2,
  Int = 3,
  Boolean = 4,
  Flow = 5,

  AnyTypeA = 6,
  AnyTypeB = 7,
  AnyTypeC = 8,

  OSCAddress = 9,
  ParameterList = 10
}

export let NodeIOResolveAnyTypes = ( nodeio: NodeIO ): NodeType | null => {
  if(nodeio.type > 0 && nodeio.type < 6){
    // It's a base type
    return nodeio.type;
  }

  // It's an "AnyType" value and we should resolve it,
  // it also means it's an input as "AnyType" is not valid on outputs
  let type = nodeio.type;

  // Check if we have any connections
  if(nodeio.connections.length > 0){
    // We do, lets copy the type of the first input
    return nodeio.connections[0].type;
  }

  // Check if there are any others of the same "AnyType"
  let other = nodeio.parent.inputs.filter(x => x !== nodeio).find(x => x.type === type);
  if(other){
    // There are others with the same type, lets copy that type
    // Does other have any connections

    if(other.connections.length > 0){
      return other.connections[0].type;
    }
  }

  // We can't resolve it yet
  return null;
}

export let NodeIOLinkColours = ( nodeio: NodeIO ) => {
  let cols: any = {
    1: '#ffff9f',
    2: '#cda0cb',
    3: '#7ecaca',
    4: '#8bc0a2',
    5: '#edeae3'
  }

  let type = NodeIOResolveAnyTypes(nodeio);
  return type ? cols[type] : '#fff5';
}

export interface NodeStatic{
  name: string,
  type: NodeType,
  value: any
}