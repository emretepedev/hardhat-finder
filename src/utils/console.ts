import { yellow } from "chalk";
import { inspect, type InspectOptions } from "util";
import { PLUGIN_NAME } from "~/constants";

export const useWarningConsole = (message: string) => {
  console.log(yellow(`Warning in plugin ${PLUGIN_NAME}:\n` + message));
};

export const useInspectConsole = (
  message: string | unknown,
  options: InspectOptions
) => {
  console.log(inspect(message, options));
};
