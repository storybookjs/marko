import type { Meta, Story } from "@storybook/marko";
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

export const Default: Story<Input> = {
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
};

export const InitialCount: Story<Input> = {
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
};
