import { HardhatPluginError } from "hardhat/plugins";
import { PLUGIN_NAME } from "~/constants";
import type { Finder } from "~/extensions/Finder";

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
    get(target: Finder, property: string) {
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
        // eslint-disable-next-line
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
          error as Error
        );
      }
    },
  };

  return new Proxy(finder, handler);
};

const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
