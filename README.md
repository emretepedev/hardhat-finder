# hardhat-finder

Hardhat plugin to find compiler outputs of contracts.

## What

This plugin will help you with reviews and implementations by giving compiler outputs of contracts.

## Installation

Install the plugin via `npm`:

```bash
npm install hardhat-finder
```

Install the plugin via `yarn`:

```bash
yarn add hardhat-finder
```

---

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-finder");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-finder";
```

## Tasks

This plugin adds the `finder` task to Hardhat:

```
Usage: hardhat [GLOBAL OPTIONS] finder [--colorify] [--compact] [--contract-name <STRING>] [--contract-path <INPUTFILE>] [--depth <INT>] [--include-dependencies] [--max-string-length <INT>] [--no-compile] [--output-dir <STRING>] [--prettify] [--write-to-file] [...outputs]
$ hardhat finder --prettify --colorify --contract-path contracts/Example.sol --contract-name Example abi bytecode

@@@@@@@ contracts/Example.sol:Example @@@@@@@
======= Abi ======= (contracts/Example.sol:Example)
[
  {
    inputs: [],
    name: 'foo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  }
]
======= Bytecode ======= (contracts/Example.sol:Example)
'0x608060405234801561001057600080fd5b5060b68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063c298557814602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60006005905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea264697066735822122086e7e92f8524c3c79ce92e0551a14a908c36694cb02510ce7a32d137d929e93764736f6c63430008040033'
```

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding an `finder` field whose type is `Finder`.

## Configuration

This plugin extends the `HardhatUserConfig`'s `FinderUserConfig` object with the `finder` field.

This is an example of how to set it:

```js
module.exports = {
  finder: {
    contract: {
      path: "contracts/Example.sol",
      name: "Example",
    },
    outputs: [
      "metadata",
      "storage-layout",
      "dependencies-info",
      "source-code",
      "fully-qualified-name",
      "method-identifiers",
    ],
    depth: Infinity,
    maxStringLength: Infinity,
    includeDependencies: false,
    colorify: false,
    prettify: false,
    compact: false,
    noCompile: false,
    runOnCompile: false,
  },
};
```

| Option              | Type       | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Description                                                         |
| ------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| outputs             | _String[]_ | ["artifact", "build-info", "abi", "metadata", "bytecode", "bytecode-runtime", "link-references", "link-references-runtime", "immutable-references", "immutable-references-runtime", "source-code", "dependencies-source-code", "dependencies-info", "settings", "solc-version", "ast", "method-identifiers", "opcodes", "opcodes-runtime", "storage-layout", "fully-qualified-name", "developer-document", "user-document", "generated-sources", "generated-sources-runtime", "source-map", "source-map-runtime"] | Types of output the contract wants to print.                        |
| depth               | _Number_   | Infinity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | The maximum number of nested JSON objects to be printed in outputs. |
| maxStringLength     | _Number_   | Infinity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | The maximum number of string lengths to be printed in outputs.      |
| includeDependencies | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Include contract dependencies in outputs.                           |
| colorify            | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Colorize the outputs.                                               |
| prettify            | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Beautify the outputs.                                               |
| compact             | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Compact the outputs.                                                |
| writeToFile         | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Write the outputs to a file.                                        |
| outputDir           | _String_   | finder-outputs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Directory to save the outputs.                                      |
| noCompile           | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Don't compile before running this task.                             |
| runOnCompile        | _Boolean_  | false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Run finder task during compile task.                                |

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access `finder` through the Hardhat Runtime Environment anywhere you need it (tasks, scripts, tests, etc).

```ts
import { finder } from "hardhat";

async function main() {
  const contractPath = "contracts/ExampleLibrary.sol";
  const contractName = "ExampleLibrary";
  await finder.setFor({
    contractPath,
    contractName,
  });

  console.log(finder.getUserDocument());
  console.log(finder.getDeveloperDocument());
}
```
