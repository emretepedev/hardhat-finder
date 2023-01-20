import { task, types } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import type { ActionType } from "hardhat/types";
import type { InspectOptions } from "util";
import { PLUGIN_NAME, SUPPORTED_OUTPUTS, TASK_FINDER } from "~/constants";
import type { ContractInfo, FinderTaskArguments } from "~/types";
import { formatOutputName, useInspectConsole } from "~/utils";

const finderAction: ActionType<FinderTaskArguments> = async (
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
  } = prepareTaskArguments());

  validateTaskArguments();

  await finder.setFor(path, name, noCompile);
  const fullyQualifiedName = finder.getFullyQualifiedName();
  const contractsInfo: ContractInfo[] = [
    {
      path,
      name,
      fullyQualifiedName,
    } as {
      path: string;
      name: string;
      fullyQualifiedName: string;
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

  for (const contractInfo of contractsInfo) {
    console.log(`@@@@@@@ ${contractInfo.fullyQualifiedName} @@@@@@@`);
    if (
      contractInfo.fullyQualifiedName !== contractsInfo[0].fullyQualifiedName
    ) {
      await finder.setFor(contractInfo.path, contractInfo.name, noCompile);
    }

    for (const output of outputs) {
      const outputName = formatOutputName(output);
      const functionName = `get${outputName.pascalCaseFormat}`;
      // eslint-disable-next-line
      const result = (await (finder as any)[functionName]()) as unknown;
      const content = prettify ? result : JSON.stringify(result);

      console.log(
        `======= ${outputName.humanReadableFormat} ======= (${finder.contractFullyQualifiedName})`
      );
      useInspectConsole(content, inspectOptions);
    }
  }

  function prepareTaskArguments() {
    return {
      path: path || config.finder.contract?.path,
      name: name || config.finder.contract?.name,
      outputs:
        outputs ||
        (config.finder.outputs.length > 0 && config.finder.outputs) ||
        SUPPORTED_OUTPUTS,
      depth: depth ?? config.finder.depth,
      maxStringLength: maxStringLength ?? config.finder.maxStringLength,
      includeDependencies:
        includeDependencies || config.finder.includeDependencies,
      colorify: colorify || config.finder.colorify,
      prettify: prettify || config.finder.prettify,
      compact: compact || config.finder.compact,
      noCompile: noCompile || config.finder.noCompile,
    };
  }

  function validateTaskArguments() {
    // eslint-disable-next-line
    outputs!!.forEach((output) => {
      if (!SUPPORTED_OUTPUTS.includes(output)) {
        throw new HardhatPluginError(
          PLUGIN_NAME,
          `\nUnsupported Output: '${output}'.\n` +
            `All supported contract outputs: ${SUPPORTED_OUTPUTS.toString()}`
        );
      }
    });
  }
};

task<FinderTaskArguments>(TASK_FINDER)
  .addOptionalParam(
    "path",
    "Path to the contract file.",
    undefined,
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
