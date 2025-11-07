use crate::{ runtime::nodes::RuntimeNode, structs::{ nodes::Node, parameter_types::ParameterType } };

pub struct ConditionalIfEqual{
  outputs: Vec<Vec<( String, isize, isize )>>,
  value1: ParameterType,
  value2: ParameterType
}

impl ConditionalIfEqual{
  pub fn new( node: Node ) -> Box<Self>{
    Box::new(Self {
      outputs: node.outputs.iter()
        .map(| x | {
          x.connections.iter().map(| x | { ( x.node.clone(), x.index, x.value_type ) }).collect()
        }).collect(),
      value1: ParameterType::None,
      value2: ParameterType::None,
    })
  }
}

impl RuntimeNode for ConditionalIfEqual{
  fn outputs( &self ) -> Vec<Vec<( String, isize, isize )>> { self.outputs.clone() }
  fn execute_dry( &mut self, _: &Vec<ParameterType> ) -> Option<Vec<ParameterType>> { Some(vec![]) }

  fn execute( &mut self ) -> Option<Vec<ParameterType>> {
    if self.value1 == ParameterType::None && self.value2 == ParameterType::None{
      None
    } else{
      let equal = self.value1 == self.value2;
      Some(vec![ ParameterType::Flow(equal), ParameterType::Flow(!equal) ])
    }
  }

  fn update_arg( &mut self, index: usize, arg: ParameterType ) -> bool {
    match index{
      1 => {
        self.value1 = arg;
      }
      2 => {
        self.value2 = arg;
      }
      _ => {}
    }

    false
  }

  fn is_entrypoint( &self ) -> bool { false }
}