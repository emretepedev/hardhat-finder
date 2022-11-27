// tslint:disable:no-shadowed-variable
import { HardhatPluginError } from "hardhat/plugins";
import { ActionType } from "hardhat/types";
import { inspect, InspectOptions } from "util";

import { PLUGIN_NAME, SUPPORTED_OUTPUTS } from "../constants";
import { ContractInfo, FinderConfig, FinderTaskArguments } from "../types";
import { formatOutputName, getFinderProxy } from "../util";

export const finder: ActionType<FinderTaskArguments> = async (
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
  } = prepareTaskArguments(
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
    config.finder
  ));

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
    console.log(`@@@@@@@ ${contractInfo.fullyQualifiedName} @@@@@@@`);
    if (contractInfo.fullyQualifiedName !== contractsInfo[0].fullyQualifiedName)
      await finder.setFor(contractInfo.path, contractInfo.name, noCompile);

    for (const output of outputs) {
      const outputName = formatOutputName(output);
      const functionName = `get${outputName.pascalCaseFormat}`;
      const content = prettify
        ? await finderProxy[functionName]
        : JSON.stringify(await finderProxy[functionName]);

      console.log(
        `======= ${outputName.humanReadableFormat} ======= (${finder.contractFullyQualifiedName})`
      );
      console.log(inspect(content, inspectOptions));
    }
  }
};

const prepareTaskArguments = (
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
  }: Partial<FinderTaskArguments>,
  finderConfig: FinderConfig
) => {
  path ||= finderConfig.contract.path;
  name ||= finderConfig.contract.name;

  outputs ||=
    (finderConfig.outputs.length > 0 && finderConfig.outputs) ||
    SUPPORTED_OUTPUTS;
  depth = undefined !== depth ? depth : finderConfig.depth;
  maxStringLength =
    undefined !== maxStringLength
      ? maxStringLength
      : finderConfig.maxStringLength;
  includeDependencies = includeDependencies || finderConfig.includeDependencies;
  colorify ||= finderConfig.colorify;
  prettify ||= finderConfig.prettify;
  compact ||= finderConfig.compact;
  noCompile ||= finderConfig.noCompile;

  return {
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
  };
};

const validateTaskArguments = ({ outputs }: Partial<FinderTaskArguments>) => {
  let unsupportedOutput = "";
  const isSubset = outputs!!.every((item) =>
    SUPPORTED_OUTPUTS.includes((unsupportedOutput = item))
  );

  if (!isSubset)
    throw new HardhatPluginError(
      PLUGIN_NAME,
      `\nUnsupported Output: '${unsupportedOutput}'.\n` +
        `All supported contract outputs: ${SUPPORTED_OUTPUTS}`
    );
};
