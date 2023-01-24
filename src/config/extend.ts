import type { ConfigExtender } from "hardhat/types";
import { defaultFinderConfig } from "~/config";
import { merge } from "~/utils";

export const finderConfigExtender: ConfigExtender = (config, userConfig) => {
  config.finder = merge(defaultFinderConfig, userConfig.finder);
};
