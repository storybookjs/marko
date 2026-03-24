import { normalizeStory } from "storybook/internal/preview-api";
import type {
  Args,
  ArgsEnhancer,
  ArgTypesEnhancer,
  StrictArgTypes,
  StrictInputType,
} from "storybook/internal/types";

import type { MarkoRenderer } from "./types";

export { renderToCanvas, render } from "./render";

export const parameters = { renderer: "marko" };

/**
 * Storybook does some normalization _before_ argTypesEnhancers (the one
 * I found was `type: "foo"` => `type: { name: "foo" }`), so we need to
 * re-normalize after updating stuff
 */
function normalizeArgTypes(
  argTypes: StrictArgTypes,
  id: string,
  title: string,
): StrictArgTypes {
  const normalized = normalizeStory(
    "__argTypes__",
    { argTypes },
    { id, title },
  );
  return normalized.argTypes ?? argTypes;
}

function flattenAttrTags(
  argTypes: StrictArgTypes,
  args: Args | undefined,
  prefix = "",
) {
  const newArgTypes: StrictArgTypes = {};
  const newArgs: Args | undefined = args ? {} : undefined;

  for (const key in argTypes) {
    if (key.startsWith("@")) continue;
    const argType = argTypes[key];
    const name = argType.name || key;
    const table = prefix
      ? {
          ...argType.table,
          category: prefix.substring(0, prefix.length - 3),
          subcategory: argType.table?.subcategory || argType.table?.category,
        }
      : argType.table;

    if (argType["@"]) {
      newArgTypes[prefix + key] = {
        ...argType,
        name: "@" + name,
        control: { disable: true },
        table,
      };
      newArgs && (newArgs[prefix + key] = null);

      const [otherArgTypes, otherArgs] = flattenAttrTags(
        argType["@"] as StrictInputType,
        args?.[key],
        prefix + "@" + key + " > ",
      );

      Object.assign(newArgTypes, otherArgTypes);
      newArgs && Object.assign(newArgs, otherArgs);
    } else {
      newArgTypes[prefix + key] = { ...argType, name, table };
      if (args && key in args) {
        newArgs![prefix + key] = args[key];
      }
    }
  }

  return [newArgTypes, newArgs] as const;
}

function addControllableChangeHandlers(argTypes: StrictArgTypes) {
  for (const key in argTypes) {
    const argType = argTypes[key];

    if (argType.controllable && !argTypes[key + "Change"]) {
      argTypes[key].name =
        (argType.name || key) + ", " + (argType.name || key) + "Change";
    }
  }
  return argTypes;
}

function addBodyContentSummary(argTypes: StrictArgTypes) {
  for (const key in argTypes) {
    if (argTypes[key].bodyContent) {
      argTypes[key].table = {
        ...argTypes[key].table,
        type: argTypes[key].table?.type || { summary: "Marko.Body" },
      };
    }
  }
  return argTypes;
}

export const argTypesEnhancers: ArgTypesEnhancer<MarkoRenderer>[] = [
  ({ argTypes, initialArgs }) => flattenAttrTags(argTypes, initialArgs)[0],
  ({ argTypes }) => addControllableChangeHandlers(argTypes),
  ({ argTypes }) => addBodyContentSummary(argTypes),
  ({ argTypes, id, title }) => normalizeArgTypes(argTypes, id, title),
];

export const argsEnhancers: ArgsEnhancer<MarkoRenderer>[] = [
  ({ initialArgs, argTypes }) =>
    flattenAttrTags(argTypes, initialArgs)[1] || {},
];
