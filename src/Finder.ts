import chalk from "chalk";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { HardhatPluginError } from "hardhat/plugins";
import {
  Artifact,
  BuildInfo,
  HardhatRuntimeEnvironment,
  LinkReferences,
} from "hardhat/types";
import { normalize } from "path";

import { PLUGIN_NAME } from "./constants";
import {
  CompilerOutputBytecode,
  CompilerOutputContract,
  ContractInfo,
  ImmutableReferences,
  Metadata,
  SolcVersion,
  SourceDependencies,
} from "./types";

// TODO: add proxy for runtime. check `contractPath` and `contractName` exclude for `setFor`. If they are undefined throw a HardhatPluginError error.
// TODO: add asm, function-debug, function-debug-runtime
export class Finder {
  private _hre: HardhatRuntimeEnvironment;
  private _compiledOnce = false;
  private _warnedOnce = false;
  public contractPath!: string;
  public contractName!: string;
  public contractFullyQualifiedName = String();
  public contractArtifact = new Object() as Artifact;
  public contractBuildInfo = new Object() as BuildInfo;
  public contractMetadata = new Object() as Metadata;
  public contractOutput = new Object() as CompilerOutputContract;

  constructor(
    hre: HardhatRuntimeEnvironment,
    contractPath: string = hre.config.finder.contract.path,
    contractName: string = hre.config.finder.contract.name
  ) {
    this._hre = hre;
    this._setInitialContractInfo(contractPath, contractName);
  }

  public setFor = async (
    contractPath: string = this.contractPath,
    contractName: string = this.contractName,
    noCompile: boolean = this._hre.config.finder.noCompile
  ) => {
    if (!noCompile && !this._compiledOnce) {
      this._compiledOnce = true;

      for (const compiler of this._hre.config.solidity.compilers)
        compiler.settings.outputSelection["*"]["*"].push("storageLayout");

      await this._hre.run(TASK_COMPILE, { noFinder: true, quiet: true });
    } else {
      if (!this._compiledOnce && !this._warnedOnce) {
        this._warnedOnce = true;

        console.log(
          chalk.yellow(
            `Warning in plugin ${PLUGIN_NAME}: ` +
              "\nThese functions do not work as expected when the 'noCompile' option is set to true:\n" +
              "- storage-layout / getStorageLayout()"
          )
        );
      }
    }

    this._setInitialContractInfo(contractPath, contractName);

    this.contractArtifact = this.getArtifact();
    this.contractBuildInfo = await this.getBuildInfo();
    this.contractOutput =
      this.contractBuildInfo.output.contracts[contractPath][contractName];
    this.contractMetadata = this.getMetadata();
  };

  public getArtifact = (): Artifact => {
    const artifact = this._hre.artifacts.readArtifactSync(
      this.contractFullyQualifiedName
    );

    return artifact;
  };

  public getBuildInfo = async (): Promise<BuildInfo> => {
    const buildInfo = await this._hre.artifacts.getBuildInfo(
      this.contractFullyQualifiedName
    );

    if (!buildInfo)
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "\nThere is no Build Info for target contract.\n" +
          "Make sure the contract path and name are valid.\n" +
          "Make sure the artifacts exist.\n" +
          "Compile with hardhat or re-run this task without --no-compile flag to create new artifacts."
      );

    return buildInfo;
  };

  public getAbi = (): any[] => {
    const abi = this.contractArtifact.abi;

    return abi;
  };

  public getMetadata = (): Metadata => {
    const metadataStr: string = (this.contractOutput as any).metadata;

    let metadata: Metadata;
    try {
      metadata = JSON.parse(metadataStr);
    } catch {
      throw new HardhatPluginError(PLUGIN_NAME, "\nInvalid metadata file");
    }

    return metadata;
  };

  public getBytecode = (): string => {
    const bytecode = this.contractArtifact.bytecode;

    return bytecode;
  };

  public getBytecodeRuntime = (): string => {
    const bytecodeRuntime = this.contractArtifact.deployedBytecode;

    return bytecodeRuntime;
  };

  public getLinkReferences = (): LinkReferences => {
    const linkReferences = this.contractArtifact.linkReferences;

    return linkReferences;
  };

  public getLinkReferencesRuntime = (): LinkReferences => {
    const linkReferencesRuntime = this.contractArtifact.deployedLinkReferences;

    return linkReferencesRuntime;
  };

  public getImmutableReferences = (): ImmutableReferences | undefined => {
    const immutableReferences =
      this.contractOutput.evm.bytecode.immutableReferences;

    return immutableReferences;
  };

  public getImmutableReferencesRuntime = ():
    | ImmutableReferences
    | undefined => {
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

  public getDependenciesInfo = (): ContractInfo[] => {
    const paths = Object.keys(this.contractMetadata.sources).filter(
      (source) => source !== this.contractPath
    );

    const sourceDependenciesInfo: ContractInfo[] = [];
    for (const path of paths) {
      const name = Object.keys(
        this.contractBuildInfo.output.contracts[path]
      )[0];
      const fullyQualifiedName = `${path}:${name}`;

      const sourceDependencyInfo: ContractInfo = {
        path,
        name,
        fullyQualifiedName,
      };

      sourceDependenciesInfo.push(sourceDependencyInfo);
    }

    return sourceDependenciesInfo;
  };

  public getSettings = () => {
    const settings = this.contractBuildInfo.input.settings;

    return settings;
  };

  public getSolcVersion = (): SolcVersion => {
    const solcVersion: SolcVersion = {
      short: this.contractBuildInfo.solcVersion,
      long: this.contractBuildInfo.solcLongVersion,
    };

    return solcVersion;
  };

  public getAst = (): any => {
    const ast = this.contractBuildInfo.output.sources[this.contractPath!!].ast;

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

  private _setInitialContractInfo = (
    contractPath: string,
    contractName: string
  ) => {
    this._validate(
      (this.contractPath = normalize(contractPath)),
      (this.contractName = contractName)
    );
    this.contractFullyQualifiedName = this.getFullyQualifiedName();
  };

  private _validate = (contractPath: string, contractName: string) => {
    const contractPathRegexp = new RegExp("\\.sol$");
    if (!contractPathRegexp.test(contractPath))
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nInvalid Path File: '${contractPath}'.\n` +
          "Make sure the contract path points to a '.sol' file.\n" +
          "Example: contracts/Foo.sol"
      );

    const contractNameRegexp = new RegExp("^[\\w\\d$]+$", "i");
    if (!contractNameRegexp.test(contractName))
      throw new HardhatPluginError(
        PLUGIN_NAME,
        `\nInvalid contract name: '${contractName}'.`
      );
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
}

// solc outputs: abi,asm,ast,bin,bin-runtime,devdoc,function-debug,function-debug-runtime
// ++ generated-sources,generated-sources-runtime,hashes,metadata,opcodes,srcmap
// ++ srcmap-runtime,storage-layout,userdoc
