import { DEFAULT_HIDE_WARNINGS, DEFAULT_NO_COMPILE } from "~/constants";
import type { CompilerTaskArguments, FinderExtensionOptions } from "~/types";

export const defaultExtensionOptions: FinderExtensionOptions = {
  noCompile: DEFAULT_NO_COMPILE,
  hideWarnings: DEFAULT_HIDE_WARNINGS,
};

export const defaultExtensionCompilerTaskArgs: CompilerTaskArguments = {
  noFinder: true,
  quiet: true,
  force: true,
};
