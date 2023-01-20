import { lazyObject } from "hardhat/plugins";
import type { EnvironmentExtender } from "hardhat/types";
import { Finder } from "~/extensions/Finder";
import { getFinderProxy } from "~/utils";

export const finderEnvironmentExtender: EnvironmentExtender = (hre) => {
  hre.finder = lazyObject(() => getFinderProxy(new Finder(hre)));
};
