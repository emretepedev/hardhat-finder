import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { finderConfigExtender } from "./config";
import { SUPPORTED_OUTPUTS, TASK_FINDER } from "./constants";
import { Finder } from "./Finder";
import { finderCompile } from "./tasks/compile";
import { finder } from "./tasks/finder";
import "./type-extensions";

extendConfig(finderConfigExtender);

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.finder = lazyObject(
    () =>
      new Finder(
        hre,
        hre.config.finder.contract.path,
        hre.config.finder.contract.name
      )
  );
});

task(TASK_FINDER)
  .addOptionalPositionalParam(
    "path",
    "Path to the contract file.",
    undefined,
    types.inputFile
  )
  .addOptionalPositionalParam(
    "name",
    "Name of the contract.",
    undefined,
    types.string
  )
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
  .setAction(finder);

task(TASK_COMPILE)
  .addFlag(
    "noFinder",
    "Don't run Finder after running this task, even if finder.runOnCompile.enabled option is true"
  )
  .setAction(finderCompile);
