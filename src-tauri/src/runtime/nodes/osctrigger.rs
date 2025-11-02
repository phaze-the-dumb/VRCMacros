use crate::{ runtime::nodes::RuntimeNode, structs::{ nodes::Node, parameter_types::ParameterType } };

pub struct OSCTrigger{
  outputs: Vec<Vec<( String, isize, isize )>>,
  address: String,
  runtime_active: bool
}

impl OSCTrigger{
  pub fn new( node: Node ) -> Box<Self>{
    dbg!(&node);

    Box::new(Self {
      address: node.statics[0].value.as_str().unwrap().to_owned(),
      outputs: node.outputs.iter()
        .map(| x | {
          x.connections.iter().map(| x | { ( x.node.clone(), x.index, x.value_type ) }).collect()
        }).collect(),
      runtime_active: false
    })
  }
}

impl RuntimeNode for OSCTrigger{
  fn outputs( &self ) -> Vec<Vec<( String, isize, isize )>> {
    self.outputs.clone()
  }

  fn execute_dry( &mut self, msg: &Vec<ParameterType> ) -> Option<Vec<ParameterType>> {
    if let ParameterType::String(address) = &msg[0]{
      if *address == self.address{
        self.runtime_active = true;
        Some(msg.clone())
        // The first value is technically the address value,
        // but this value gets ignored as the first output of
        // the osctrigger node is a flow output which gets ignored
        // on dry runs.
      } else{
        self.runtime_active = false;
        None
      }
    } else{
      self.runtime_active = false;
      None
    }
  }

  fn execute( &mut self ) -> bool {
    let execute = self.runtime_active;
    self.runtime_active = false;

    execute
  }

  fn update_arg( &mut self, _: usize, _: ParameterType ) -> bool { false }
  fn is_entrypoint( &self ) -> bool { true }
}