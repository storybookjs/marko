import { type Meta, type Story } from "@storybook/marko";
import Controllable, { type Input } from "./index.marko";

export default {
  title: "Controllable",
  component: Controllable,
  parameters: {
    docs: {
      description: {
        component: 'An `<input>` with `type="checkbox"`',
      },
    },
  },
  argTypes: {
    value: {
      changeHandler: true,
      control: { type: "text" },
      description: "Controllable text value",
      table: {
        type: { summary: "string" },
      },
    },
    pressed: {
      changeHandler: true,
      control: { type: "boolean" },
      description: "Controllable boolean value",
      table: {
        type: { summary: "boolean" },
        defaultValue: {
          summary: "false",
        },
      },
    },
    color: {
      options: ["red", "orange", "yellow"],
      changeHandler: true,
      control: { type: "inline-radio" },
      description: "Controllable boolean value",
      table: {
        type: { summary: "boolean" },
      },
    },
  },
} satisfies Meta<Input>;

export const Default = {
  parameters: {
    docs: {
      source: {
        code: `<controllable/>`,
      },
    },
  },
} as Story<Input>;

export const InitialValues = {
  args: {
    value: "Marko!",
    pressed: true,
    color: "orange",
  },
  parameters: {
    docs: {
      source: {
        code: `<controllable/>`,
      },
    },
  },
} as Story<Input>;
