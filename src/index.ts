import { extendConfig, extendEnvironment } from "hardhat/config";
import { finderConfigExtender } from "~/config";
import { finderEnvironmentExtender } from "~/environments";
import "~/tasks";
import "~/type-extensions";

extendConfig(finderConfigExtender);

extendEnvironment(finderEnvironmentExtender);
