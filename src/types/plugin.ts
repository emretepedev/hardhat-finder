export interface FinderConfig {
  contract?: {
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
  writeToFile: boolean;
  outputDir: string;
}

export interface FinderUserConfig {
  contract?: {
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
  writeToFile: boolean;
  outputDir: string;
}
