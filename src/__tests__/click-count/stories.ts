import type { Story, Meta } from "../../client";
import ClickCount from "./index.marko";

interface Input {
  count?: number;
  onIncrement?(ev: Event): void;
}

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
    "on-increment": {
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
