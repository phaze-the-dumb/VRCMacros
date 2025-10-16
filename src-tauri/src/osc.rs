// https://gist.github.com/phaze-the-dumb/634daacb5141eae2f846e20987dba7a8

use std::{ net::UdpSocket, sync::mpsc::Sender };

use serde::Serialize;

use crate::structs::parameter_types::ParameterType;

#[derive(Debug, Clone, Serialize)]
pub struct OSCMessage{
  pub address: String,
  pub values: Vec<ParameterType>
}

impl PartialEq for OSCMessage{
  // Technically this isn't exactly equal, but the only time i'm checking if OSCMessage's are equal
  // Is when i'm checking for the "address" value

  fn eq(&self, other: &Self) -> bool {
    self.address == other.address
  }

  fn ne(&self, other: &Self) -> bool {
    self.address != other.address
  }
}

// TODO: Implement osc bundles
pub fn start_server( sender: Sender<OSCMessage>, addr: &str ) {
  let socket = UdpSocket::bind(addr).unwrap();

  loop {
    let mut buf = [0; 1024];
    let (amt, _src) = socket.recv_from(&mut buf).unwrap();

    let buf = &mut buf[..amt];
    if buf[0] != 0x2F { panic!("Packet is not an OSC Message"); }

    let mut addr: Vec<u8> = Vec::new();
    let mut value_start = 0;

    loop{
      let byte = buf[value_start];
      if byte == 0x00{ break; }

      value_start += 1;
      addr.push(byte);
    }

    loop{
      let byte = buf[value_start];
      value_start += 1;

      if byte == 0x2C{ break; }
    }

    let mut types: Vec<u8> = Vec::new();

    loop{
      let byte = buf[value_start];
      if byte == 0x00{ break; }

      types.push(byte);
      value_start += 1;
    }

    value_start = ((value_start as f32 / 4.0).ceil() * 4.0) as usize;
    let mut values = Vec::new();

    for tp in types{
      match tp{
        0x69 => {
          let val_buf = &buf[value_start..value_start + 4];

          let bytes = <&[u8; 4]>::try_from(val_buf).unwrap().clone();
          let int = i32::from_be_bytes(bytes);

          values.push(ParameterType::Int(int));
          value_start += 4;
        },
        0x66 => {
          let val_buf = &buf[value_start..value_start + 4];

          let bytes = <&[u8; 4]>::try_from(val_buf).unwrap().clone();
          let float = f32::from_be_bytes(bytes);

          values.push(ParameterType::Float(float));
          value_start += 4;
        },
        0x54 => values.push(ParameterType::Boolean(true)),
        0x46 => values.push(ParameterType::Boolean(false)),
        _ => {}
      }
    }

    let message = OSCMessage {
      address: String::from_utf8(addr.clone()).unwrap(),
      values: values
    };

    sender.send(message).unwrap();
  }
}

pub fn send_message( address: &str, values: Vec<ParameterType>, ip_addr: &str ){
  let socket = UdpSocket::bind("127.0.0.1:0").unwrap();
  let mut buf: Vec<u8> = Vec::new();

  buf.append(&mut address.as_bytes().to_vec());

  let rounded_len = ((((buf.len() as f64) + 1.0) / 4.0).ceil() * 4.0) as usize;
  let original_len = buf.len();

  for _i in original_len..rounded_len {
    buf.push(0);
  }

  buf.push(0x2C);

  let mut value_count = 1;
  for value in values.clone() {
    match value {
      ParameterType::Boolean( val ) => buf.push(if val { 0x54 } else { 0x46 }),
      ParameterType::Float(_) => buf.push(0x66),
      ParameterType::Int(_) => buf.push(0x69),
      ParameterType::String(_) => buf.push(0x73),
      _ => {}
    };

    value_count += 1;
  }

  for _i in 0..4 - (value_count  % 4) {
    buf.push(0);
  }

  for value in values{
    match value{
      ParameterType::Float( val ) => buf.append(&mut val.to_be_bytes().to_vec()),
      ParameterType::Int( val ) => buf.append(&mut val.to_be_bytes().to_vec()),
      ParameterType::String( val ) => {
        let mut str_buf = val.as_bytes().to_vec();
        let buf_len = str_buf.len().clone();

        buf.append(&mut str_buf);

        for _i in 0..4 - (buf_len  % 4) {
          buf.push(0);
        }
      }
      _ => {}
    }
  }

  println!("{:X?}", &buf);
  socket.send_to(&buf, ip_addr).unwrap();
}