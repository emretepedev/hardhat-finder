import { HardhatPluginError } from "hardhat/plugins";
import { PLUGIN_NAME } from "~/constants";
import type { Finder } from "~/extensions/Finder";
import { useErrorMessage } from "~/utils";

export const getFinderProxy = (finder: Finder) => {
  const handler = {
    get(target: Finder, property: string) {
      try {
        if (
          property !== "setFor" &&
          (!target.contractPath || !target.contractName)
        ) {
          throw new HardhatPluginError(
            PLUGIN_NAME,
            useErrorMessage(
              `You have to set 'config.finder.contract' option or run 'Finder.setFor()' function before using ${property} function.`
            )
          );
        }

        // TODO: If the getStorageLayout function is called with noCompile: true,
        // throw an error with a warning in the Finder.setFor function.
        // Additionally, move the push process to retrieve the storage layout
        // in Finder.compile().

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
        return Reflect.get(...arguments);
      } catch (error: any) {
        if (error instanceof HardhatPluginError) {
          throw error;
        }

        throw new HardhatPluginError(
          PLUGIN_NAME,
          useErrorMessage(
            `Something went wrong with '${property}' in ${target.constructor.name} class\n` +
              "Error:\n" +
              `name: ${error?.name as string}\n` +
              `message: ${error?.message as string}\n` +
              `stack: ${error?.stack as string}`
          ),
          error as Error
        );
      }
    },
  };

  return new Proxy(finder, handler);
};
