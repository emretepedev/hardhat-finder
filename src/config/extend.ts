import deepmerge from "deepmerge";
import type { ConfigExtender } from "hardhat/types";
import { cloneDeep } from "lodash";
import { defaultFinderConfig } from "~/config";

export const finderConfigExtender: ConfigExtender = (config, userConfig) => {
  const defaultConfig = defaultFinderConfig;
  if (userConfig.finder !== undefined) {
    const customConfig = cloneDeep(userConfig.finder);
    config.finder = deepmerge(defaultConfig, customConfig);
  } else {
    config.finder = defaultConfig;
  }
};
