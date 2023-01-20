import { yellow } from "chalk";
import { HardhatPluginError } from "hardhat/plugins";
import { inspect, type InspectOptions } from "util";
import { PLUGIN_NAME } from "~/constants";
import type { Finder } from "~/extensions/Finder";

export const uppercaseFirstChar = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const formatOutputName = (str: string, separator = "-") => {
  const words = str.split(separator);
  const uppercaseWords = words.map((word) => uppercaseFirstChar(word));
  const humanReadableFormat = uppercaseWords.join(" ");
  const searchRegexp = new RegExp(" ", "g");
  const pascalCaseFormat = humanReadableFormat.replace(searchRegexp, "");

  return {
    pascalCaseFormat,
    humanReadableFormat,
  };
};

export const getFinderProxy = (finder: Finder): Finder => {
  const handler = {
    get(target: any, property: string) {
      try {
        if (
          property !== "setFor" &&
          (!target.contractPath || !target.contractName)
        ) {
          throw new HardhatPluginError(
            PLUGIN_NAME,
            `\nYou have to set 'config.finder.contract' option or run 'Finder.setFor()' function before using ${property} function.`
          );
        }

        // @ts-ignore
        return Reflect.get(...arguments);
      } catch (error: any) {
        if (error instanceof HardhatPluginError) {
          throw error;
        }

        throw new HardhatPluginError(
          PLUGIN_NAME,
          `\nSomething went wrong with '${property}' in ${target.constructor.name} class\n` +
            "Error:\n" +
            `name: ${error?.name}\n` +
            `message: ${error?.message}\n` +
            `stack: ${error?.stack}`,
          error
        );
      }
    },
  };

  return new Proxy(finder, handler);
};

export const useWarningConsole = (message: string) => {
  console.log(yellow(`Warning in plugin ${PLUGIN_NAME}:\n` + message));
};

export const useInspectConsole = (message: string, options: InspectOptions) => {
  console.log(inspect(message, options));
};
