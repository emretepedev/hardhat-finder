import { existsSync, mkdirSync, writeFileSync } from "fs";
import { task, types } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import type { ActionType } from "hardhat/types";
import { dirname } from "path";
import type { InspectOptions } from "util";
import { PLUGIN_NAME, SUPPORTED_OUTPUTS, TASK_FINDER } from "~/constants";
import type { ContractInfo, FinderTaskArguments } from "~/types";
import {
  formatOutputName,
  useErrorMessage,
  useHeaderConsole,
  useInspectConsole,
  useSubheaderConsole,
} from "~/utils";

const finderAction: ActionType<FinderTaskArguments> = async (
  {
    contractPath,
    contractName,
    outputs,
    depth,
    maxStringLength,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
    writeToFile,
    outputDir,
  },
  { config, finder }
) => {
  ({
    contractPath,
    contractName,
    outputs,
    depth,
    maxStringLength,
    includeDependencies,
    colorify,
    prettify,
    compact,
    noCompile,
    writeToFile,
    outputDir,
  } = prepareTaskArguments());

  validateTaskArguments();

  if (!contractPath || !contractName) {
    throw new HardhatPluginError(
      PLUGIN_NAME,
      useErrorMessage(
        "Contract path or name is required to find the contract outputs.\n" +
          "You can set 'config.finder.contract' option or provide 'contract-path' and 'contract-name' arguments."
      )
    );
  }

  await finder.setFor({
    contractPath,
    contractName,
    options: {
      noCompile,
    },
  });

  const fullyQualifiedName = finder.getFullyQualifiedName();
  const contractsInfo: ContractInfo[] = [
    {
      path: contractPath,
      name: contractName,
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

  for (const contractInfo of contractsInfo) {
    useHeaderConsole(`@@@@@@@ ${contractInfo.fullyQualifiedName} @@@@@@@`);
    if (contractInfo.fullyQualifiedName !== fullyQualifiedName) {
      await finder.setFor({
        contractPath: contractInfo.path,
        contractName: contractInfo.name,
      });
    }

    for (const output of outputs) {
      const outputName = formatOutputName(output);
      const functionName = `get${outputName.pascalCaseFormat}`;
      // eslint-disable-next-line
      const result: string = await (finder as any)[functionName]();
      const content = prettify ? result : JSON.stringify(result);

      useSubheaderConsole(
        `======= ${outputName.humanReadableFormat} ======= (${contractInfo.fullyQualifiedName})`
      );
      useInspectConsole(content, inspectOptions);

      if (writeToFile) {
        const filePath = `${outputDir}/${contractInfo.fullyQualifiedName}/${output}`;
        const dirPath = dirname(filePath);
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }
        writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
      }
    }
  }

  function prepareTaskArguments() {
    return {
      contractPath: contractPath || config.finder.contract?.path,
      contractName: contractName || config.finder.contract?.name,
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
      writeToFile: writeToFile || config.finder.writeToFile,
      outputDir: outputDir || config.finder.outputDir,
    };
  }

  function validateTaskArguments() {
    // eslint-disable-next-line
    outputs!!.forEach((output) => {
      if (!SUPPORTED_OUTPUTS.includes(output)) {
        throw new HardhatPluginError(
          PLUGIN_NAME,
          useErrorMessage(
            `Unsupported output: '${output}'.\n` +
              `All supported contract outputs: ${SUPPORTED_OUTPUTS.toString()}`
          )
        );
      }
    });
  }
};

task<FinderTaskArguments>(TASK_FINDER)
  .addOptionalParam(
    "contractPath",
    "Path to the contract file.",
    undefined,
    types.inputFile
  )
  .addOptionalParam(
    "contractName",
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
  .addFlag("writeToFile", "Write the outputs to a file.")
  .addOptionalParam(
    "outputDir",
    "Directory to save the outputs.",
    undefined,
    types.string
  )
  .setDescription("Find various outputs of any existing contracts.")
  .setAction(finderAction);
