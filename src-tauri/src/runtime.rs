use std::collections::HashMap;

use anyhow::{bail, Result};

use crate::{runtime::nodes::RuntimeNodeTree, structs::parameter_types::ParameterType};

pub mod commands;
pub mod nodes;

// TODO: Variables

pub fn recurse_runtime(entry: String, tab: &mut RuntimeNodeTree, args: Vec<ParameterType>) -> Result<()>{
  let ( out_args, output_map ) = runtime(entry, tab, args)?;

  let mut next_node_args: HashMap<String, Vec<ParameterType>> = HashMap::new();

  for i in 0..out_args.len(){
    let links = &output_map[i];

    for ( id, link_index, _ ) in links{
      let link_index = link_index.clone() as usize;

      if next_node_args.contains_key(id){
        let args: &mut _ = next_node_args.get_mut(id).unwrap();
        while args.len() < link_index{ args.push(ParameterType::None); }

        args.push(out_args[i].clone());
      } else{
        let mut args = vec![ParameterType::None; link_index];
        args.push(out_args[i].clone());

        next_node_args.insert(id.clone(), args);
      }
    }
  }

  for i in 0..out_args.len(){
    if let ParameterType::Flow(next) = out_args[i]{
      if next{
        let links = &output_map[i];

        for ( id, _, _ ) in links{
          let args = next_node_args.remove(id).unwrap();
          recurse_runtime(id.clone(), tab, args)?;
        }
      }
    }
  }

  Ok(())
}

pub fn runtime(entry: String, tab: &mut RuntimeNodeTree, mut args: Vec<ParameterType>) -> Result<(Vec<ParameterType>, Vec<Vec<(String, isize, isize)>>)> {
  let node = tab.nodes.get_mut(&entry);
  if node.is_none() { bail!("Cannot find node"); }

  let node = node.unwrap();
  let inputs = node.inputs();

  let mut needed_input_nodes = HashMap::new();

  for i in 0..inputs.len(){
    if i >= args.len() || args[i] == ParameterType::None{
      if let Some(input) = &inputs[i]{
        if !needed_input_nodes.contains_key(&input.0){
          needed_input_nodes.insert(input.0.clone(), vec![(input.1.clone(), i.clone())]);
        } else{
          needed_input_nodes.get_mut(&input.0).unwrap().push((input.1.clone(), i.clone()));
        }
      }
    }
  }

  for ( id, needed ) in needed_input_nodes{
    let (out_args, _) = runtime(id, tab, vec![]).unwrap();
    // TODO: Combine output with args

    for ( output, input ) in needed{
      let arg = &out_args[output as usize];

      if args.len() >= input{
        while args.len() < input{ args.push(ParameterType::None); }
        args.push(arg.clone());
      } else{
        args[input] = arg.clone();
      }
    }
  }

  let node = tab.nodes.get_mut(&entry); // TODO: Find a way to only do this lookup once
  if node.is_none() { bail!("Cannot find node"); }

  let node = node.unwrap();

  let output = node.execute(args);
  Ok((output, node.outputs()))
}
