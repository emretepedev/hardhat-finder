import chalk from "chalk";
import { HardhatPluginError } from "hardhat/plugins";
import { inspect, type InspectOptions } from "util";

import { PLUGIN_NAME } from "./constants";
import type { Finder } from "./Finder";

export const uppercaseFirstChar = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const formatOutputName = (str: string, seperator: string = "-") => {
  const words = str.split(seperator);
  const uppercasedWords = words.map((word) => uppercaseFirstChar(word));
  const humanReadableFormat = uppercasedWords.join(" ");
  const searchRegexp = new RegExp(" ", "g");
  const pascalCaseFormat = humanReadableFormat.replace(searchRegexp, "");

  return {
    pascalCaseFormat,
    humanReadableFormat,
  };
};

export const getFinderProxy = (finder: Finder) => {
  const handler = {
    get(target: any, property: string) {
      try {
        return target[property]();
      } catch (error: any) {
        if (!(error instanceof HardhatPluginError))
          throw new HardhatPluginError(
            PLUGIN_NAME,
            `\nSomething went wrong in logic for '${property}' in ${target.constructor.name} class\n` +
              `Error:\n` +
              `name: ${error.name}\n` +
              `message: ${error.message}\n` +
              `stack: ${error.stack}`,
            error
          );
      }
    },
  };

  return new Proxy(finder, handler);
};

export const useWarningConsole = (message: string) => {
  console.log(chalk.yellow(`Warning in plugin ${PLUGIN_NAME}:\n` + message));
};

export const useConsole = (message: string) => {
  console.log(message);
};

export const useInspectConsole = (message: string, options: InspectOptions) => {
  console.log(inspect(message, options));
};
