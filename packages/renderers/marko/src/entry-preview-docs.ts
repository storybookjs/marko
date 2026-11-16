import {
  createSummaryValue,
  enhanceArgTypes,
  extractComponentDescription,
  extractComponentSectionObject,
  hasDocgen,
  isTooLongForTypeSummary,
  SourceType,
} from "storybook/internal/docs-tools";
import type {
  Addon_DecoratorFunction,
  ArgTypesEnhancer,
  SBType,
  StrictArgTypes,
} from "storybook/internal/types";

import { flattenAttrTags } from "./attr-tag";
import type { DocgenProp } from "./docgen";
import type { MarkoStoryResult } from "./types";

/** Marko's own test for an event handler attribute, eg `onClick`, `on-click`. */
const handlerReg = /^on[-A-Z]/;

export const decorators: Addon_DecoratorFunction<MarkoStoryResult>[] = [];

const argTypesFromDocgen = (
  docgenProps: Record<string, DocgenProp>,
): StrictArgTypes => {
  const argTypes: StrictArgTypes = {};
  // docs-tools reads the first prop to tell the type system, so needs one.
  if (!Object.keys(docgenProps).length) return argTypes;
  const props = extractComponentSectionObject(docgenProps).filter(
    (prop) => prop !== null,
  );
  // `fooChange` alongside `foo` is the controllable pattern: `foo` is wired
  // up as controllable and the handler is rendered as part of its row.
  const isChangeHandler = (name: string) =>
    name.endsWith("Change") &&
    docgenProps[name]?.tsType.type === "function" &&
    name.slice(0, -"Change".length) in docgenProps;
  for (const { propDef } of props) {
    const { name, description, sbType, defaultValue, jsDocTags } = propDef;
    if (isChangeHandler(name)) continue;
    const { tsType, "@": attrTagProps } = docgenProps[name];
    // docs-tools makes options of a union but not a lone literal, and leaves
    // string escapes in.
    const literals =
      tsType.name === "literal"
        ? [tsType]
        : tsType.elements?.every((element) => element.name === "literal") &&
          tsType.elements;
    const type: SBType = {
      required: propDef.required,
      ...(literals
        ? {
            name: "enum",
            value: literals.map((element) => JSON.parse(element.value!)),
          }
        : sbType),
    };
    argTypes[name] = {
      name,
      ...(isChangeHandler(name + "Change") && { controllable: true }),
      description,
      type,
      table: {
        // docs-tools summarizes eg a union as just "union"; show the type,
        // with a long one shortened the way docs-tools does.
        type: isTooLongForTypeSummary(tsType.raw)
          ? createSummaryValue(tsType.name, tsType.raw)
          : createSummaryValue(tsType.raw),
        jsDocTags,
        defaultValue: defaultValue ?? undefined,
      },
      ...(attrTagProps && {
        "@": argTypesFromDocgen(attrTagProps),
      }),
    };
  }
  return argTypes;
};

const extractArgTypes = (component: Marko.Template): StrictArgTypes | null => {
  if (!hasDocgen<{ props: Record<string, DocgenProp> }>(component)) {
    return null;
  }
  // User argTypes are already flattened when these merge in; match them.
  const argTypes = flattenAttrTags(
    argTypesFromDocgen(component.__docgenInfo.props),
    undefined,
  )[0];
  for (const key in argTypes) {
    // Only a story's own `"@"` argTypes also flatten its args (which custom
    // renders may not expect), so docgen's keep the arg's own control.
    if (argTypes[key]["@"]) {
      delete argTypes[key]["@"];
      delete argTypes[key].control;
    }
    // Skips attr tags' handlers (keyed `@tag > onFoo`): an action arg for one
    // would create the tag.
    if (handlerReg.test(key) && argTypes[key].type?.name === "function") {
      argTypes[key].action = key;
      argTypes[key].table = { ...argTypes[key].table, category: "Events" };
    }
  }
  return argTypes;
};

export const parameters = {
  docs: {
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: "marko",
    },
    extractArgTypes,
    extractComponentDescription,
  },
};

const editableTypes = new Set(["enum", "string", "number", "boolean"]);

/**
 * A type Storybook can't edit, eg `number | string`, also stops it inferring a
 * control from the story's args, so a primitive initial arg's type is used.
 */
export const typeFromArgs: ArgTypesEnhancer = ({ argTypes, initialArgs }) => {
  for (const key in argTypes) {
    const { type } = argTypes[key];
    const argType = typeof initialArgs?.[key];
    if (
      type &&
      !editableTypes.has(type.name) &&
      (argType === "string" || argType === "number" || argType === "boolean")
    ) {
      argTypes[key].type = { ...type, name: argType };
    }
  }
  return argTypes;
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [
  enhanceArgTypes,
  typeFromArgs,
];

export { applyDecorators } from "./decorators";
