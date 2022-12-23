import { HardhatPluginError } from "hardhat/plugins";
import type { ActionType } from "hardhat/types";
import type { InspectOptions } from "util";

import { PLUGIN_NAME, SUPPORTED_OUTPUTS } from "../constants";
import type { ContractInfo, FinderConfig, FinderTaskArguments } from "../types";
import {
  formatOutputName,
  getFinderProxy,
  useConsole,
  useInspectConsole,
} from "../utils";

export const finderAction: ActionType<FinderTaskArguments> = async (
  {
    path,
    name,
    outputs,
    depth,
    maxStringLength,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
  },
  { config, finder }
) => {
  ({
    path,
    name,
    outputs,
    depth,
    maxStringLength,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
  } = prepareTaskArguments(config.finder, {
    path,
    name,
    outputs,
    depth,
    maxStringLength,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
  }));

  validateTaskArguments({
    outputs,
  });

  await finder.setFor(path, name, noCompile);
  const fullyQualifiedName = finder.getFullyQualifiedName();
  const contractsInfo: ContractInfo[] = [
    {
      path,
      name,
      fullyQualifiedName,
    },
  ];

  if (includeDependencies) {
    const sourceDependenciesInfo = finder.getDependenciesInfo();
    contractsInfo.push(...sourceDependenciesInfo);
  }

  const inspectOptions: InspectOptions = {
    colors: colorify,
    depth,
    maxStringLength,
    compact,
  };

  const finderProxy = getFinderProxy(finder);
  for (const contractInfo of contractsInfo) {
    useConsole(`@@@@@@@ ${contractInfo.fullyQualifiedName} @@@@@@@`);
    if (
      contractInfo.fullyQualifiedName !== contractsInfo[0].fullyQualifiedName
    ) {
      await finder.setFor(contractInfo.path, contractInfo.name, noCompile);
    }

    for (const output of outputs) {
      const outputName = formatOutputName(output);
      const functionName = `get${outputName.pascalCaseFormat}`;
      const content = prettify
        ? await finderProxy[functionName]
        : JSON.stringify(await finderProxy[functionName]);

      useConsole(
        `======= ${outputName.humanReadableFormat} ======= (${finder.contractFullyQualifiedName})`
      );
      useInspectConsole(content, inspectOptions);
    }
  }
};

const prepareTaskArguments = (
  finderConfig: FinderConfig,
  {
    path,
    name,
    outputs,
    maxStringLength,
    depth,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
  }: FinderTaskArguments
) => {
  return {
    path: path || finderConfig.contract.path,
    name: name || finderConfig.contract.name,
    outputs:
      outputs ||
      (finderConfig.outputs.length > 0 && finderConfig.outputs) ||
      SUPPORTED_OUTPUTS,
    depth: depth !== undefined ? depth : finderConfig.depth,
    maxStringLength:
      maxStringLength !== undefined
        ? maxStringLength
        : finderConfig.maxStringLength,
    includeDependencies:
      includeDependencies || finderConfig.includeDependencies,
    colorify: colorify || finderConfig.colorify,
    prettify: prettify || finderConfig.prettify,
    compact: compact || finderConfig.compact,
    noCompile: noCompile || finderConfig.noCompile,
  };
};

const validateTaskArguments = ({ outputs }: FinderTaskArguments) => {
  outputs!!.forEach((output) => {
    if (!SUPPORTED_OUTPUTS.includes(output)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nUnsupported Output: '${output}'.\n` +
          `All supported contract outputs: ${SUPPORTED_OUTPUTS}`
      );
    }
  });
};
