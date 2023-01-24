export interface FinderTaskArguments {
  path?: string;
  name?: string;
  outputs?: string[];
  depth?: number;
  maxStringLength?: number;
  includeDependencies?: boolean;
  colorify?: boolean;
  prettify?: boolean;
  compact?: boolean;
  noCompile?: boolean;
}

export interface CompilerTaskArguments {
  noFinder: boolean;
  quiet: boolean;
  force: boolean;
  [argument: string]: any;
}

export interface CompilerTaskUserArguments {
  [argument: string]: any;
}
