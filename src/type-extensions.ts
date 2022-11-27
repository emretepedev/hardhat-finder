import "hardhat/types/config";
import "hardhat/types/runtime";

import { Finder } from "./Finder";
import { FinderConfig, FinderUserConfig } from "./types";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    finder?: FinderUserConfig;
  }
  export interface HardhatConfig {
    finder: FinderConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    finder: Finder;
  }
}
