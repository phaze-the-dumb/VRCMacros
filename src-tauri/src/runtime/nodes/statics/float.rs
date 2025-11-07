use crate::{ runtime::nodes::RuntimeNode, structs::{ nodes::Node, parameter_types::ParameterType } };

pub struct StaticFloat{
  outputs: Vec<Vec<( String, isize, isize )>>,
  value: Option<f32>
}

impl StaticFloat{
  pub fn new( node: Node ) -> Box<Self>{
    dbg!(&node);

    let value = &node.statics[0].value;

    Box::new(Self {
      value: if value.is_null(){ None } else { Some(value.as_f64().unwrap() as f32) },
      outputs: node.outputs.iter()
        .map(| x | {
          x.connections.iter().map(| x | { ( x.node.clone(), x.index, x.value_type ) }).collect()
        }).collect(),
    })
  }
}

impl RuntimeNode for StaticFloat{
  fn outputs( &self ) -> Vec<Vec<( String, isize, isize )>> {
    self.outputs.clone()
  }

  fn execute_dry( &mut self, _: &Vec<ParameterType> ) -> Option<Vec<ParameterType>> {
    if self.value.is_some(){
      Some(vec![ ParameterType::Float(self.value.clone().unwrap()) ])
    } else{
      None
    }
  }

  fn execute( &mut self ) -> Option<Vec<ParameterType>> { None }

  fn update_arg( &mut self, _: usize, _: ParameterType ) -> bool { false }
  fn is_entrypoint( &self ) -> bool { true }
}