import type { ActionType } from "hardhat/types";

import { TASK_FINDER } from "../constants";
import type { FinderTaskArguments } from "../types";

export const finderCompileAction: ActionType<{ noFinder: boolean }> = async (
  { noFinder },
  { run, config },
  runSuper
) => {
  await runSuper();

  if (!noFinder && config.finder.runOnCompile && config.finder.contract) {
    const finderTaskArguments: FinderTaskArguments = {
      path: config.finder.contract.path,
      name: config.finder.contract.name,
      outputs: config.finder.outputs,
      noCompile: true,
    };
    await run(TASK_FINDER, finderTaskArguments);
  }
};
