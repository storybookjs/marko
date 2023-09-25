import { type Meta, type Story } from "@storybook/marko";
import ClickCount, { type Input } from "./index.marko";

export default {
  title: "ClickCount",
  component: ClickCount,
  parameters: {
    docs: {
      description: {
        component:
          "A component that renders a button and tracks the number of clicks",
      },
    },
  },
  argTypes: {
    onIncrement: {
      description: "Event fired each time the internal counter is incremented",
      table: { category: "Events" },
    },
    count: {
      defaultValue: 0,
      control: { type: "number" },
      description: "What the initial count of the counter should be",
      table: {
        category: "Input",
        defaultValue: {
          summary: "0",
        },
      },
    },
  },
} as Meta<Input>;

export const Default = {
  argTypes: {
    onIncrement: {
      action: "increment from default",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<click-count/>`,
      },
    },
  },
} as Story<Input>;

export const InitialCount = {
  args: { count: 2 },
  argTypes: {
    onIncrement: {
      action: "increment from initial count",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<click-count count=2/>`,
      },
    },
  },
} as Story<Input>;
