export interface OSCMessage{
  address: string,
  values: OSCValue[]
}

export interface OSCValue{
  Float?: number,
  Int?: number,
  Boolean?: boolean,
  String?: string
}