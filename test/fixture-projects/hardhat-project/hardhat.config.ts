import type { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  finder: {
    contract: {
      path: "contracts/Example.sol",
      name: "Example",
    },
  },
};

export default config;
