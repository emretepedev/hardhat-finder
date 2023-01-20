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
  [argument: string]: any;
}
