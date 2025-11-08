use anyhow::{ Result, bail };
use serde::Serialize;

#[derive(Serialize, Clone, Debug, PartialEq)]
#[serde(tag = "key", content = "value")]
pub enum ParameterType {
  AnyType(String),
  Label(&'static str),

  Int(i32),
  Float(f32),
  Boolean(bool),
  String(String),
  Flow(bool),

  None
}

impl ParameterType{
  pub fn as_bool( &self ) -> Result<bool>{
    match self{
      ParameterType::Boolean( val ) => Ok(val.clone()),
      ParameterType::Int( val ) => if *val == 0{ Ok(false) } else { Ok(true) },
      _ => bail!("Cannot cast to bool.")
    }
  }

  pub fn as_int( &self ) -> Result<i32>{
    match self{
      ParameterType::Boolean( val ) => if *val{ Ok(1) } else { Ok(0) },
      ParameterType::Int( val ) => Ok(val.clone()),
      ParameterType::Float( val ) => Ok(val.round().clone() as i32),
      ParameterType::String( val ) => Ok(val.clone().parse()?),
      _ => bail!("Cannot cast to int.")
    }
  }

  pub fn as_float( &self ) -> Result<f32>{
    match self{
      ParameterType::Int( val ) => Ok(val.clone() as f32),
      ParameterType::Float( val ) => Ok(val.clone()),
      ParameterType::String( val ) => Ok(val.clone().parse()?),
      _ => bail!("Cannot cast to float.")
    }
  }

  pub fn as_string( &self ) -> Result<String>{
    match self{
      ParameterType::Boolean( val ) => Ok(val.clone().to_string()),
      ParameterType::Int( val ) => Ok(val.clone().to_string()),
      ParameterType::Float( val ) => Ok(val.clone().to_string()),
      ParameterType::String( val ) => Ok(val.clone()),
      _ => bail!("Cannot cast to string.")
    }
  }
}