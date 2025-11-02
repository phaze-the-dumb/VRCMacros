use anyhow::{ bail, Result };

use crate::{ runtime::nodes::RuntimeNodeTree, structs::parameter_types::ParameterType };

pub mod nodes;
pub mod commands;

// This is horrible. I know, I'm sorry.

pub fn runtime_dry( entry: String, parameters: &Vec<ParameterType>, tab: &RuntimeNodeTree ) -> Result<()>{
  let node = tab.nodes.get(&entry);
  if node.is_none(){ bail!("Cannot find node"); }

  let mut node = node.unwrap().lock().unwrap();

  let output_map = node.outputs();
  let args = node.execute_dry(parameters);

  drop(node);

  if args.is_some(){
    let args = args.unwrap();

    for i in 0..args.len(){
      let arg = &args[i];

      for output in &output_map[i]{
        if output.2 == 5{ break; } // Ignore flow outputs

        let next_node = tab.nodes.get(&output.0);
        if next_node.is_none(){ bail!("Cannot find node {}", output.0) }

        let mut next_node = next_node.unwrap().lock().unwrap();
        let can_update = next_node.update_arg(output.1 as usize, arg.clone());

        if can_update{
          drop(next_node);
          // ^^ Drop this MutexGuard before we enter the runtime,
          //    as it blocks the runtime for gaining a lock on the node
          //    TODO: Please find a better way of making it mutable

          runtime_dry(output.0.clone(), &vec![], &tab)?;
        }
      }
    }
  }

  Ok(())
}


pub fn runtime( entry: String, tab: &RuntimeNodeTree ) -> Result<()>{
  let node = tab.nodes.get(&entry);
  if node.is_none(){ bail!("Cannot find node"); }

  let mut node = node.unwrap().lock().unwrap();

  let next = node.execute();
  if next{
    let outputs = node.outputs();

    drop(node);

    for outputs in outputs{
      for output in outputs{
        if output.2 == 5{
          // This is a flow output, continue
          runtime(output.0, &tab)?;
        }
      }
    }
  }

  Ok(())
}