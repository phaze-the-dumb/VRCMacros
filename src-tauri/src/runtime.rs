use anyhow::{bail, Result};

use crate::{runtime::nodes::RuntimeNodeTree, structs::parameter_types::ParameterType};

pub mod commands;
pub mod nodes;

// This is horrible. I know, I'm sorry.

pub fn runtime_dry(
  entry: String,
  parameters: &Vec<ParameterType>,
  tab: &mut RuntimeNodeTree,
) -> Result<()> {
  let node = tab.nodes.get_mut(&entry);
  if node.is_none() {
    bail!("Cannot find node");
  }

  let node = node.unwrap();

  let output_map = node.outputs();
  let args = node.execute_dry(parameters);

  if args.is_some() {
    let args = args.unwrap();

    for i in 0..args.len() {
      let arg = &args[i];

      for output in &output_map[i] {
        if output.2 == 5 {
          break;
        } // Ignore flow outputs

        let next_node = tab.nodes.get_mut(&output.0);
        if next_node.is_none() {
          bail!("Cannot find node {}", output.0)
        }

        let next_node = next_node.unwrap();
        let can_update = next_node.update_arg(output.1 as usize, arg.clone());

        if can_update {
          runtime_dry(output.0.clone(), &vec![], tab)?;
        }
      }
    }
  }

  Ok(())
}

pub fn runtime(entry: String, tab: &mut RuntimeNodeTree) -> Result<()> {
  let node = tab.nodes.get_mut(&entry);
  if node.is_none() {
    bail!("Cannot find node");
  }

  let node = node.unwrap();

  let next = node.execute();
  if next.is_some() {
    let next = next.unwrap();

    let outputs = node.outputs();

    for i in 0..next.len() {
      let arg = &next[i];
      if i >= outputs.len() {
        break;
      }

      for output in &outputs[i] {
        if let ParameterType::Flow(next) = arg {
          if *next {
            // This is a flow output, continue
            runtime(output.0.clone(), tab)?;
          }
        }
      }
    }
  }

  Ok(())
}
