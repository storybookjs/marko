import { normalizeStory } from "storybook/internal/preview-api";
import type {
  ArgsEnhancer,
  ArgTypesEnhancer,
  StrictArgTypes,
} from "storybook/internal/types";

import { flattenAttrTags } from "./attr-tag";
import type { MarkoRenderer } from "./types";

export { render, renderToCanvas } from "./render";

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

const nameControllableRows: ArgTypesEnhancer<MarkoRenderer> = ({
  argTypes,
}) => {
  for (const key in argTypes) {
    const argType = argTypes[key];
    const name = argType.name || key;

    if (argType.controllable && !argTypes[key + "Change"]) {
      argType.name = name + ", " + name + "Change";
    }
  }
  return argTypes;
};
// Runs after the first pass, which includes docs marking args controllable.
nameControllableRows.secondPass = true;

export const argTypesEnhancers: ArgTypesEnhancer<MarkoRenderer>[] = [
  ({ argTypes, initialArgs }) => flattenAttrTags(argTypes, initialArgs)[0],
  ({ argTypes }) => addBodyContentSummary(argTypes),
  ({ argTypes, id, title }) => normalizeArgTypes(argTypes, id, title),
  nameControllableRows,
];

export const argsEnhancers: ArgsEnhancer<MarkoRenderer>[] = [
  ({ initialArgs, argTypes }) =>
    flattenAttrTags(argTypes, initialArgs)[1] || {},
];
