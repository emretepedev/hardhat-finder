// TODO: reorder the outputs
export const SUPPORTED_OUTPUTS = [
  "artifact",
  "build-info",
  "abi",
  "metadata",
  "bytecode",
  "bytecode-runtime",
  "link-references",
  "link-references-runtime",
  "immutable-references",
  "immutable-references-runtime",
  "source-code",
  "dependencies-source-code",
  "dependencies-info",
  "settings",
  "solc-version",
  "ast",
  "method-identifiers",
  "opcodes",
  "opcodes-runtime",
  "storage-layout",
  "fully-qualified-name",
  "developer-document",
  "user-document",
  "generated-sources",
  "generated-sources-runtime",
  "source-map",
  "source-map-runtime",
];
export const DEFAULT_OUTPUTS = SUPPORTED_OUTPUTS;
export const DEFAULT_DEPTH = Infinity;
export const DEFAULT_MAX_STRING_LENGTH = Infinity;
export const DEFAULT_INCLUDE_DEPENDENCIES = false;
export const DEFAULT_COLORIFY = false;
export const DEFAULT_PRETTIFY = false;
export const DEFAULT_COMPACT = false;
export const DEFAULT_NO_COMPILE = false;
export const DEFAULT_RUN_ON_COMPILE = false;
