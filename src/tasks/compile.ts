import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import type { ActionType, TaskArguments } from "hardhat/types";
import { TASK_FINDER } from "~/constants";
import type { CompilerTaskArguments, FinderTaskArguments } from "~/types";

const compileAction: ActionType<TaskArguments> = async (
  taskArgs: CompilerTaskArguments,
  { run, config },
  runSuper
) => {
  await runSuper(taskArgs);

  if (!taskArgs.noFinder && config.finder.runOnCompile) {
    const finderTaskArguments: FinderTaskArguments = {
      depth: config.finder.depth === Infinity ? undefined : config.finder.depth,
      maxStringLength:
        config.finder.maxStringLength === Infinity
          ? undefined
          : config.finder.maxStringLength,
      noCompile: true,
    };
    await run(TASK_FINDER, finderTaskArguments);
  }
};

task<CompilerTaskArguments>(TASK_COMPILE)
  .addFlag(
    "noFinder",
    "Don't run Finder after running this task, even if finder.runOnCompile option is true"
  )
  .setAction(compileAction);
