import { bgGray, bgWhite, yellow } from "chalk";
import { inspect, type InspectOptions } from "util";
import { PLUGIN_NAME } from "~/constants";

export const useWarningConsole = (message: string) => {
  console.log(yellow(`Warning in plugin ${PLUGIN_NAME}:\n${message}\n`));
};

export const useErrorMessage = (message: string) => {
  return `\n${message}\n`;
};

export const useHeaderConsole = (message: string) => {
  console.log(bgWhite(`\n${message}\n`));
};

export const useSubheaderConsole = (message: string) => {
  console.log(bgGray(`\n${message}\n`));
};

export const useInspectConsole = (
  message: string | unknown,
  options: InspectOptions
) => {
  console.log(inspect(message, options));
};
