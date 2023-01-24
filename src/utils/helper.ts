import deepmerge from "deepmerge";
import { cloneDeep } from "lodash";
import { MergeOptions } from "~/types";

export const formatOutputName = (str: string, separator = "-") => {
  const words = str.split(separator);
  const uppercaseWords = words.map((word) => uppercaseFirstChar(word));
  const humanReadableFormat = uppercaseWords.join(" ");
  const searchRegexp = new RegExp(" ", "g");
  const pascalCaseFormat = humanReadableFormat.replace(searchRegexp, "");

  return {
    pascalCaseFormat,
    humanReadableFormat,
  };
};

export const merge = <T>(
  x: Partial<T>,
  y?: Partial<T>,
  overrides: Partial<T> = {},
  options?: MergeOptions
) => {
  let result: Partial<T>;
  if (y !== undefined) {
    if (options?.clone) {
      const clone = cloneDeep(y);
      result = deepmerge(x, clone);
    } else {
      result = deepmerge(x, y);
    }
  } else {
    result = x;
  }

  result = deepmerge<T>(result, overrides);

  return result as T;
};

const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
