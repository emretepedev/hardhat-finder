import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { task, types } from "hardhat/config";
import { SUPPORTED_OUTPUTS, TASK_FINDER } from "~/constants";

import { finderCompileAction } from "./compile";
import { finderAction } from "./finder";

task(TASK_FINDER)
  .addOptionalParam(
    "path",
    "Path to the contract file.",
    undefined,
    // TODO: change to types.string for flexibility because of custom root and contracts folder structure. (or get root and contracts file and replace it in code.)
    types.inputFile
  )
  .addOptionalParam("name", "Name of the contract.", undefined, types.string)
  .addOptionalVariadicPositionalParam(
    "outputs",
    `Types of output the contract wants to print. All supported outputs: ${SUPPORTED_OUTPUTS.toString()}`,
    undefined,
    types.string
  )
  .addOptionalParam(
    "depth",
    "The maximum number of nested JSON objects to be printed in outputs.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "maxStringLength",
    "The maximum number of string lengths to be printed in outputs.",
    undefined,
    types.int
  )
  .addFlag("includeDependencies", "Include contract dependencies in outputs.")
  .addFlag("colorify", "Colorize the outputs.")
  .addFlag("prettify", "Beautify the outputs.")
  .addFlag("compact", "Compact the outputs.")
  .addFlag("noCompile", "Don't compile before running this task.")
  .setDescription("Find various outputs of any existing contracts.")
  .setAction(finderAction);

task(TASK_COMPILE)
  .addFlag(
    "noFinder",
    "Don't run Finder after running this task, even if finder.runOnCompile option is true"
  )
  .setAction(finderCompileAction);
