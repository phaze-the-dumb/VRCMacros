export interface OSCMessage{
  address: string,
  values: OSCValue[]
}

export interface OSCValue{
  key: string,
  value: any
}