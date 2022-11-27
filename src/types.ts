import {
  CompilerOutputBytecode as BaseCompilerOutputBytecode,
  CompilerOutputContract as BaseCompilerOutputContract,
} from "hardhat/types";

export interface FinderConfig {
  contract: {
    path: string;
    name: string;
  };
  outputs: string[];
  depth: number;
  maxStringLength: number;
  includeDependencies: boolean;
  colorify: boolean;
  prettify: boolean;
  compact: boolean;
  noCompile: boolean;
  runOnCompile: boolean;
}

export interface FinderUserConfig {
  contract: {
    path: string;
    name: string;
  };
  outputs?: string[];
  depth?: number;
  maxStringLength?: number;
  includeDependencies?: boolean;
  colorify?: boolean;
  prettify?: boolean;
  compact?: boolean;
  noCompile?: boolean;
  runOnCompile?: boolean;
}

export interface FinderTaskArguments {
  path: string;
  name: string;
  outputs: string[];
  depth: number;
  maxStringLength: number;
  includeDependencies: boolean;
  colorify: boolean;
  prettify: boolean;
  compact: boolean;
  noCompile: boolean;
}

export interface Metadata {
  compiler: MetadataCompiler;
  language: string;
  output: MetadataOutput;
  settings: MetadataSettings;
  sources: MetadataSources;
  version: number;
}

interface MetadataCompiler {
  version: string;
}

interface MetadataOutput {
  abi: any;
  devdoc: any;
  userdoc: any;
}

interface MetadataSettings {
  compilationTarget: MetadataCompilationTarget;
  evmVersion: string;
  libraries: MetadataLibraries;
  metadata: MetadataMetadata;
  optimizer: MetadataOptimizer;
  remappings: string[];
  viaIR?: boolean;
}

interface MetadataCompilationTarget {
  [contractPath: string]: string;
}
interface MetadataLibraries {
  [fullyQualifiedName: string]: string;
}

interface MetadataMetadata {
  bytecodeHash: string;
}

interface MetadataOptimizer {
  enabled: boolean;
  runs: number;
}

interface MetadataSources {
  [contractPath: string]: MetadataSourcesDetails;
}

interface MetadataSourcesDetails {
  keccak256: string;
  license: string;
  urls: string[];
}

export interface SourceDependencies {
  [contractPath: string]: string;
}

export interface Settings {
  optimizer: SettingsOptimizer;
  metadata?: SettingsMetadata;
  outputSelection: SettingsOutputSelection;
  evmVersion?: string;
  libraries?: SettingsLibraries;
}

interface SettingsOptimizer {
  enabled?: boolean;
  runs?: number;
}
interface SettingsMetadata {
  useLiteralContent: boolean;
}
interface SettingsOutputSelection {
  [sourceName: string]: {
    [contractName: string]: string[];
  };
}
interface SettingsLibraries {
  [libraryFileName: string]: {
    [libraryName: string]: string;
  };
}
export interface SolcVersion {
  short: string;
  long: string;
}

export interface MethodIdentifiers {
  [methodSignature: string]: string;
}

export interface ImmutableReferences {
  [key: string]: { start: number; length: number }[];
}

export interface ContractInfo {
  path: string;
  name: string;
  fullyQualifiedName: string;
}

export interface CompilerOutputContract extends BaseCompilerOutputContract {
  storageLayout?: StorageLayout;
}

export interface StorageLayout {
  storage: Partial<StorageLayoutStorage[]>;
  types: Partial<StorageLayoutTypes>;
}

export interface StorageLayoutStorage {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

export interface StorageLayoutTypes {
  [type: string]: {
    encoding: string;
    label: string;
    numberOfBytes: string;
  } | null;
}

export interface CompilerOutputBytecode extends BaseCompilerOutputBytecode {
  generatedSources: any;
}
