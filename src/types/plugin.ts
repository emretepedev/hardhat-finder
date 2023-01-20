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
}
