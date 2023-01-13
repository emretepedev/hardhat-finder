import { lazyObject } from "hardhat/plugins";
import { EnvironmentExtender } from "hardhat/types";
import { Finder } from "~/Finder";
import { getFinderProxy } from "~/utils";

export const finderEnvironmentExtender: EnvironmentExtender = (hre) => {
  hre.finder = lazyObject(() => getFinderProxy(new Finder(hre)));
};
