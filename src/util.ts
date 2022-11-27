import { HardhatPluginError } from "hardhat/plugins";

import { PLUGIN_NAME } from "./constants";
import { Finder } from "./Finder";

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

  const proxy = new Proxy(finder, handler);

  return proxy;
};
