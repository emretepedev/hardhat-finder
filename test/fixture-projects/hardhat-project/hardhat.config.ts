import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
  finder: {
    contract: {
      path: "contracts/Example.sol",
      name: "Example",
    },
  },
};

export default config;
