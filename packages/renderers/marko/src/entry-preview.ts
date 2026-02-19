import type { ArgTypesEnhancer, StrictArgTypes } from "storybook/internal/csf";
import type { MarkoRenderer } from "./types";

export { renderToCanvas, render } from "./render";

export const parameters = { renderer: "marko" };

export const argTypesEnhancers: ArgTypesEnhancer<MarkoRenderer>[] = [
  ({ argTypes }) => {
    const newTypes: StrictArgTypes = {};

    for (const key of Object.keys(argTypes)) {
      const argType = argTypes[key];

      newTypes[key] = { ...argType };

      const changeKey = key + "Change";
      if (argType.changeHandler && !(changeKey in argTypes)) {
        newTypes[changeKey] = {
          name: changeKey,
          description:
            typeof argType.changeHandler === "string"
              ? argType.changeHandler
              : typeof argType.changeHandler === "function"
                ? argType.changeHandler(key)
                : `Used to hoist \`${key}\` with the [controllable](https://markojs.com/docs/explanation/controllable-components) pattern. Typically added implicitly with [the \`:=\` bind syntax](https://markojs.com/docs/reference/language#shorthand-change-handlers-two-way-binding).`,
          table: {
            type: {
              summary: `(${key.charAt(0)}: ${argType.table?.type?.summary ?? "unknown"}) => void`,
            },
          },
          control: { disable: true },
        };
      }
    }
    return newTypes;
  },
];
