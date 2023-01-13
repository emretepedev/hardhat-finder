import deepmerge from "deepmerge";
import type { ConfigExtender } from "hardhat/types";
import { cloneDeep } from "lodash";
import {
  DEFAULT_COLORIFY,
  DEFAULT_COMPACT,
  DEFAULT_DEPTH,
  DEFAULT_INCLUDE_DEPENDENCIES,
  DEFAULT_MAX_STRING_LENGTH,
  DEFAULT_NO_COMPILE,
  DEFAULT_OUTPUTS,
  DEFAULT_PRETTIFY,
  DEFAULT_RUN_ON_COMPILE,
} from "~/constants";

const getDefaultConfig = () => ({
  outputs: DEFAULT_OUTPUTS,
  depth: DEFAULT_DEPTH,
  maxStringLength: DEFAULT_MAX_STRING_LENGTH,
  includeDependencies: DEFAULT_INCLUDE_DEPENDENCIES,
  colorify: DEFAULT_COLORIFY,
  prettify: DEFAULT_PRETTIFY,
  compact: DEFAULT_COMPACT,
  noCompile: DEFAULT_NO_COMPILE,
  runOnCompile: DEFAULT_RUN_ON_COMPILE,
});

export const finderConfigExtender: ConfigExtender = (config, userConfig) => {
  const defaultConfig = getDefaultConfig();
  if (userConfig.finder !== undefined) {
    const customConfig = cloneDeep(userConfig.finder);
    config.finder = deepmerge(defaultConfig, customConfig);
  } else {
    config.finder = defaultConfig;
  }
};
