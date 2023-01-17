// tslint:disable-next-line no-implicit-dependencies
import type { HardhatUserConfig } from "hardhat/types";
import "~/index";

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  // paths: {
  //   root: "./src",
  // },
  finder: {
    contract: {
      path: "contracts/Example.sol",
      name: "Example",
    },
    runOnCompile: true,
  },
};

export default config;
