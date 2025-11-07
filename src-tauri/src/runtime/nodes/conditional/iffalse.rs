use crate::{ runtime::nodes::RuntimeNode, structs::{ nodes::Node, parameter_types::ParameterType } };

pub struct ConditionalIfFalse{
  outputs: Vec<Vec<( String, isize, isize )>>,
  runtime_active: bool
}

impl ConditionalIfFalse{
  pub fn new( node: Node ) -> Box<Self>{
    Box::new(Self {
      outputs: node.outputs.iter()
        .map(| x | {
          x.connections.iter().map(| x | { ( x.node.clone(), x.index, x.value_type ) }).collect()
        }).collect(),
      runtime_active: false
    })
  }
}

impl RuntimeNode for ConditionalIfFalse{
  fn outputs( &self ) -> Vec<Vec<( String, isize, isize )>> { self.outputs.clone() }
  fn execute_dry( &mut self, _: &Vec<ParameterType> ) -> Option<Vec<ParameterType>> { Some(vec![]) }

  fn execute( &mut self ) -> Option<Vec<ParameterType>> {
    Some(vec![ ParameterType::Flow(!self.runtime_active), ParameterType::Flow(self.runtime_active) ])
  }

  fn update_arg( &mut self, _: usize, arg: ParameterType ) -> bool {
    if let ParameterType::Boolean(boolean) = arg{
      if boolean{
        self.runtime_active = true;
        true
      } else{
        self.runtime_active = false;
        false
      }
    } else{
      self.runtime_active = false;
      false
    }
  }

  fn is_entrypoint( &self ) -> bool { false }
}