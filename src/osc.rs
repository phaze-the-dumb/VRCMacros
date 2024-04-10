use std::{ net::UdpSocket, sync::mpsc::Sender };
use math::round;

#[derive(Clone,Copy,Debug)]
pub enum OSCTypeTag{
  INTEGER,
  FLOAT,
  TRUE,
  STRING,
  FALSE
}

#[derive(Debug, Clone)]
pub struct OSCValue{
  pub int: Option<u32>,
  pub float: Option<f32>,
  pub string: Option<String>,
  pub osc_type: OSCTypeTag
}

#[derive(Debug)]
pub struct OSCMessage{
  pub address: String,
  pub values: Vec<OSCValue>
}

pub fn start_server( sender: Sender<OSCMessage>, addr: &str ) {
  let socket = UdpSocket::bind(addr).unwrap();

  loop {
    let mut buf = [0; 1024];
    let (amt, _src) = socket.recv_from(&mut buf).unwrap();

    let buf = &mut buf[..amt];

    if buf[0] != 0x2F {
      panic!("Packet is not an OSC Message");
    }

    let mut addr: Vec<u8> = Vec::new();
    let mut type_tag: Vec<OSCTypeTag> = Vec::new();

    let mut value_start = 0;

    for i in 0..amt {
      let val = buf[i];

      if val == 44 {
        let mut j = 1;
        loop {
          match buf[i + j] {
            0x69 => { type_tag.push(OSCTypeTag::INTEGER) }
            0x66 => { type_tag.push(OSCTypeTag::FLOAT) }
            0x54 => { type_tag.push(OSCTypeTag::TRUE) }
            0x46 => { type_tag.push(OSCTypeTag::FALSE) }
            0 => { break }
            _ => {}
          }

          j += 1;
        }

        let j = j as f64;
        let place_shift = round::ceil(((j + 1.0) / 4.0) as f64, 0) * 4.0;

        value_start = i + (place_shift as usize);

        break;
      };

      if val != 0 {
        addr.push(val.clone());
      }
    }

    let mut message = OSCMessage {
      address: String::from_utf8(addr).unwrap(),
      values: Vec::new()
    };

    let mut i = 0;
    for tag in type_tag{
      match tag{
        OSCTypeTag::INTEGER => {
          let val_buf = &buf[value_start + (i * 4)..value_start + ((i + 1) * 4)];

          let bytes = <&[u8; 4]>::try_from(val_buf).unwrap().clone();
          let int = u32::from_be_bytes(bytes);

          let value = OSCValue {
            int: Some(int),
            float: None,
            string: None,
            osc_type: OSCTypeTag::INTEGER,
          };

          message.values.push(value);
        }
        OSCTypeTag::FLOAT => {
          let val_buf = &buf[value_start + (i * 4)..value_start + ((i + 1) * 4)];

          let bytes: [u8; 4] = <&[u8; 4]>::try_from(val_buf).unwrap().clone();
          let float = f32::from_be_bytes(bytes);

          let value = OSCValue {
            int: None,
            float: Some(float),
            string: None,
            osc_type: OSCTypeTag::FLOAT
          };

          message.values.push(value);
        }
        OSCTypeTag::TRUE => {
          let value = OSCValue {
            int: None,
            float: None,
            string: None,
            osc_type: OSCTypeTag::TRUE
          };

          message.values.push(value);
        }
        OSCTypeTag::FALSE => {
          let value = OSCValue {
            int: None,
            float: None,
            string: None,
            osc_type: OSCTypeTag::FALSE
          };

          message.values.push(value);
        }
        _ => {}
      }

      i += 1;
    }

    sender.send(message).unwrap();
  }
}

pub fn send_message_string( address: &str, values: Vec<OSCValue>, ip_addr: &str ){
  let socket = UdpSocket::bind("127.0.0.1:0").unwrap();
  let mut buf: Vec<u8> = Vec::new();

  buf.append(&mut address.as_bytes().to_vec());

  let rounded_len = (round::ceil(((buf.len() as f64) + 1.0) / 4.0, 0) * 4.0) as usize;
  let original_len = buf.len();

  for _i in original_len..rounded_len {
    buf.push(0);
  }

  buf.push(44);

  let mut value_count = 1;
  for value in &values {
    match value.osc_type {
      OSCTypeTag::FALSE => buf.push(0x46),
      OSCTypeTag::TRUE => buf.push(0x54),
      OSCTypeTag::FLOAT => buf.push(0x66),
      OSCTypeTag::INTEGER => buf.push(0x69),
      OSCTypeTag::STRING => buf.push(0x73)
    };

    value_count += 1;
  }

  for _i in 0..4 - (value_count  % 4) {
    buf.push(0);
  }

  for value in &values {
    match value.osc_type {
      OSCTypeTag::FLOAT => {
        buf.append(&mut value.float.unwrap().to_be_bytes().to_vec());
      },
      OSCTypeTag::INTEGER => {
        buf.append(&mut value.int.unwrap().to_be_bytes().to_vec());
      },
      OSCTypeTag::STRING => {
        let mut str_buf = value.string.clone().unwrap().as_bytes().to_vec();
        let buf_len = str_buf.len().clone();

        buf.append(&mut str_buf);

        for _i in 0..4 - (buf_len  % 4) {
          buf.push(0);
        }
      },
      _ => {}
    }
  }

  socket.send_to(&buf, ip_addr).unwrap();
}