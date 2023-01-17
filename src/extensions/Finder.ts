import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { HardhatPluginError } from "hardhat/plugins";
import type {
  Artifact,
  BuildInfo,
  HardhatRuntimeEnvironment,
} from "hardhat/types";
import { normalize } from "path";
import { PLUGIN_NAME } from "~/constants";
import type {
  CompilerOutputBytecode,
  CompilerOutputContract,
  CompilerTaskArguments,
  ContractInfo,
  Metadata,
  SourceDependencies,
} from "~/types";
import { useWarningConsole } from "~/utils";

// TODO: add asm, function-debug, function-debug-runtime
export class Finder {
  private hre: HardhatRuntimeEnvironment;
  private compiledOnce = false;
  private warnedOnce = false;
  public contractPath!: string;
  public contractName!: string;
  public contractFullyQualifiedName!: string;
  public contractArtifact!: Artifact;
  public contractBuildInfo!: BuildInfo;
  public contractMetadata!: Metadata;
  public contractOutput!: CompilerOutputContract;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  public setFor = async (
    contractPath?: string,
    contractName?: string,
    noCompile: boolean = this.hre.config.finder.noCompile,
    compilerTaskArgs: CompilerTaskArguments = {}
  ) => {
    contractPath ||= this.hre.config.finder?.contract?.path;
    contractName ||= this.hre.config.finder?.contract?.name;

    if (!contractPath || !contractName) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nMake sure the Finder.setFor() arguments are correct or 'config.finder.contract' key is set.\n` +
          `Contract Path: ${contractPath}\n` +
          `Contract Name: ${contractName}`
      );
    }

    this._setInitialContractInfo(contractPath, contractName);

    if (!noCompile && !this.compiledOnce) {
      this.compiledOnce = true;

      for (const compiler of this.hre.config.solidity.compilers) {
        compiler.settings.outputSelection["*"]["*"].push("storageLayout");
      }

      compilerTaskArgs.noFinder = true;
      await this.hre.run(TASK_COMPILE, compilerTaskArgs);
    } else {
      if (!this.compiledOnce && !this.warnedOnce) {
        this.warnedOnce = true;

        useWarningConsole(
          "These arguments or functions do NOT work as expected when 'noCompile' option is true:\n" +
            "- storage-layout / getStorageLayout()"
        );
      }
    }

    this.contractArtifact = this.getArtifact();
    this.contractBuildInfo = await this.getBuildInfo();
    this.contractOutput =
      this.contractBuildInfo.output.contracts[this.contractPath][
        this.contractName
      ];
    this.contractMetadata = this.getMetadata();
  };

  public getArtifact = () => {
    try {
      const artifact = this.hre.artifacts.readArtifactSync(
        this.contractFullyQualifiedName
      );

      return artifact;
    } catch (error: any) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "\nThere is no Artifact for target contract.\n" +
          "Make sure the contract path and name are valid.\n" +
          "Make sure the artifacts exist.\n" +
          "Compile with hardhat or re-run this task without --no-compile flag to create new artifacts.",
        error
      );
    }
  };

  public getBuildInfo = async () => {
    const buildInfo = await this.hre.artifacts.getBuildInfo(
      this.contractFullyQualifiedName
    );

    if (!buildInfo) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "\nThere is no Build Info for target contract.\n" +
          "Make sure the contract path and name are valid.\n" +
          "Make sure the artifacts exist.\n" +
          "Compile with hardhat or re-run this task without --no-compile flag to create new artifacts."
      );
    }

    return buildInfo;
  };

  public getAbi = () => {
    const abi = this.contractArtifact.abi;

    return abi;
  };

  public getMetadata = () => {
    const metadataStr: string = (this.contractOutput as any).metadata;

    let metadata: Metadata;
    try {
      metadata = JSON.parse(metadataStr);
    } catch (error: any) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "\nInvalid metadata file",
        error
      );
    }

    return metadata;
  };

  public getBytecode = () => {
    const bytecode = this.contractArtifact.bytecode;

    return bytecode;
  };

  public getBytecodeRuntime = () => {
    const bytecodeRuntime = this.contractArtifact.deployedBytecode;

    return bytecodeRuntime;
  };

  public getLinkReferences = () => {
    const linkReferences = this.contractArtifact.linkReferences;

    return linkReferences;
  };

  public getLinkReferencesRuntime = () => {
    const linkReferencesRuntime = this.contractArtifact.deployedLinkReferences;

    return linkReferencesRuntime;
  };

  public getImmutableReferences = () => {
    const immutableReferences =
      this.contractOutput.evm.bytecode.immutableReferences;

    return immutableReferences;
  };

  public getImmutableReferencesRuntime = () => {
    const immutableReferencesRuntime =
      this.contractOutput.evm.deployedBytecode.immutableReferences;

    return immutableReferencesRuntime;
  };

  public getSourceCode = () => {
    const allSources = this.contractBuildInfo.input.sources;

    return allSources[this.contractPath].content;
  };

  public getDependenciesSourceCode = () => {
    const allSources = this.contractBuildInfo.input.sources;
    const sourceDependenciesInfo = this.getDependenciesInfo();

    const sourceDependencies = new Object() as SourceDependencies;
    for (const sourceDependencyInfo of sourceDependenciesInfo)
      sourceDependencies[sourceDependencyInfo.path] =
        allSources[sourceDependencyInfo.path].content;

    return sourceDependencies;
  };

  public getDependenciesInfo = () => {
    const paths = Object.keys(this.contractMetadata.sources).filter(
      (source) => source !== this.contractPath
    );

    const sourceDependenciesInfo: ContractInfo[] = [];
    for (const path of paths) {
      const name = Object.keys(
        this.contractBuildInfo.output.contracts[path]
      )[0];

      const sourceDependencyInfo: ContractInfo = {
        path,
        name,
        fullyQualifiedName: `${path}:${name}`,
      };

      sourceDependenciesInfo.push(sourceDependencyInfo);
    }

    return sourceDependenciesInfo;
  };

  public getSettings = () => {
    const settings = this.contractBuildInfo.input.settings;

    return settings;
  };

  public getSolcVersion = () => {
    const solcVersion = {
      short: this.contractBuildInfo.solcVersion,
      long: this.contractBuildInfo.solcLongVersion,
    };

    return solcVersion;
  };

  public getAst = () => {
    const ast = this.contractBuildInfo.output.sources[this.contractPath].ast;

    return ast;
  };

  public getMethodIdentifiers = () => {
    const methodIdentifiers = this.contractOutput.evm.methodIdentifiers;

    return methodIdentifiers;
  };

  public getOpcodes = () => {
    const opcodes = this.contractOutput.evm.bytecode.opcodes;

    return opcodes;
  };

  public getOpcodesRuntime = () => {
    const opcodesRuntime = this.contractOutput.evm.deployedBytecode.opcodes;

    return opcodesRuntime;
  };

  public getStorageLayout = () => {
    return this.contractOutput.storageLayout;
  };

  public getFullyQualifiedName = () => {
    const contractFullyQualifiedName = `${this.contractPath}:${this.contractName}`;

    return contractFullyQualifiedName;
  };

  public getDeveloperDocument = () => {
    const devdoc = this.contractMetadata.output.devdoc;

    return devdoc;
  };

  public getUserDocument = () => {
    const userdoc = this.contractMetadata.output.userdoc;

    return userdoc;
  };

  public getGeneratedSources = () => {
    const generatedSources = (
      this.contractOutput.evm.bytecode as CompilerOutputBytecode
    ).generatedSources;

    return generatedSources;
  };

  public getGeneratedSourcesRuntime = () => {
    const generatedSourcesRuntime = (
      this.contractOutput.evm.deployedBytecode as CompilerOutputBytecode
    ).generatedSources;

    return generatedSourcesRuntime;
  };

  public getSourceMap = () => {
    const sourceMap = this.contractOutput.evm.bytecode.sourceMap;

    return sourceMap;
  };

  public getSourceMapRuntime = () => {
    const sourceMapRuntime = this.contractOutput.evm.deployedBytecode.sourceMap;

    return sourceMapRuntime;
  };

  private _setInitialContractInfo = (
    contractPath: string,
    contractName: string
  ) => {
    this._validate(
      (this.contractPath = contractPath && normalize(contractPath)),
      (this.contractName = contractName)
    );
    this.contractFullyQualifiedName = this.getFullyQualifiedName();
  };

  private _validate = (contractPath: string, contractName: string) => {
    const contractPathRegexp = new RegExp("\\.sol$");
    if (!contractPathRegexp.test(contractPath)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nInvalid Path File: '${contractPath}'.\n` +
          "Make sure the contract path points to a '.sol' file.\n" +
          "Example: contracts/Foo.sol"
      );
    }

    const contractNameRegexp = new RegExp("^[\\w\\d$]+$", "i");
    if (!contractNameRegexp.test(contractName)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nInvalid contract name: '${contractName}'.`
      );
    }
  };
}
