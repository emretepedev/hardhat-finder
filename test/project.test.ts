// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";

import { Finder } from "../src/extensions/Finder";

import { useEnvironment } from "./helpers";

describe("Integration tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the finder field", function () {
      assert.instanceOf(this.hre.finder, Finder);
    });

    it("The finder field should get fully qualified name", async function () {
      await this.hre.finder.setFor();
      assert.equal(
        this.hre.finder.getFullyQualifiedName(),
        "contracts/Example.sol:Example"
      );
    });

    it("The finder field should get fully qualified name", async function () {
      await this.hre.finder.setFor({
        contractPath: "contracts/ExampleLibrary.sol",
        contractName: "ExampleLibrary",
      });
      assert.equal(
        this.hre.finder.getFullyQualifiedName(),
        "contracts/ExampleLibrary.sol:ExampleLibrary"
      );
    });
  });

  describe("HardhatConfig extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the contract to the config", function () {
      assert.deepEqual(this.hre.config.finder.contract, {
        path: "contracts/Example.sol",
        name: "Example",
      });
    });
  });
});

describe("Unit tests", function () {
  describe("Finder", function () {
    useEnvironment("hardhat-project");

    describe("getFullyQualifiedName", function () {
      it("Should get fully qualified name", async function () {
        await this.hre.finder.setFor();
        assert.equal(
          this.hre.finder.getFullyQualifiedName(),
          "contracts/Example.sol:Example"
        );
      });
    });
  });
});
