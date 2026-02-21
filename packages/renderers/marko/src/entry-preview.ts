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

function flattenAttrTags(
  argTypes: StrictArgTypes,
  args: Args | undefined,
  prefix = "",
) {
  const newArgTypes: StrictArgTypes = {};
  const newArgs: Args | undefined = args ? {} : undefined;

  for (const key of Object.keys(argTypes)) {
    if (key.startsWith("@")) continue;
    const argType = argTypes[key];
    const name = argType.name || key;
    const table = prefix
      ? {
          ...argType.table,
          category: prefix.substring(0, prefix.length - 3),
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

function addChangeHandlers(argTypes: StrictArgTypes) {
  const newTypes: StrictArgTypes = {};

  for (const key of Object.keys(argTypes)) {
    const argType = argTypes[key];

    newTypes[key] = { ...argType };

    const changeKey = key + "Change";
    if (argType.changeHandler && !(changeKey in argTypes)) {
      const name = argType.name || key;
      newTypes[changeKey] = {
        name: name + "Change",
        description:
          typeof argType.changeHandler === "string"
            ? argType.changeHandler
            : typeof argType.changeHandler === "function"
              ? argType.changeHandler(name)
              : `Used to hoist \`${name}\` with the [controllable](https://markojs.com/docs/explanation/controllable-components) pattern. Typically added implicitly with [the \`:=\` bind syntax](https://markojs.com/docs/reference/language#shorthand-change-handlers-two-way-binding).`,
        table: {
          category: argType.table?.category,
          subcategory: argType.table?.subcategory,
          type: {
            summary: `(${name.charAt(0)}: ${argType.table?.type?.summary ?? "unknown"}) => void`,
          },
        },
        control: { disable: true },
      };
    }
  }
  return newTypes;
}

export const argTypesEnhancers: ArgTypesEnhancer<MarkoRenderer>[] = [
  ({ argTypes, initialArgs }) => flattenAttrTags(argTypes, initialArgs)[0],
  ({ argTypes }) => addChangeHandlers(argTypes),
];

export const argsEnhancers: ArgsEnhancer<MarkoRenderer>[] = [
  ({ initialArgs, argTypes }) =>
    flattenAttrTags(argTypes, initialArgs)[1] || {},
];
