import type { Meta, Story } from "@storybook/marko";

import AttrTags, { type Input } from "./index.marko";

export default {
  title: "AttrTags",
  component: AttrTags,
  parameters: {
    docs: {
      description: {
        component: "A component that renders attribute tags",
      },
    },
  },
  argTypes: {
    item: {
      "@": {
        icon: {
          "@": {
            // Controllable from `sizeChange` in the Input type.
            size: {
              control: { type: "inline-radio" },
            },
          },
        },
      },
    },
  },
} as Meta<Input>;

export const Default = {
  parameters: {
    docs: {
      source: {
        code: `<attr-tags/>`,
      },
    },
  },
} as Story<Input>;

export const InitialValues = {
  args: {
    header: {
      description: "Hello",
    } as any,
    item: {
      count: 5,
      name: "world",
      icon: {
        size: "small",
      },
    } as any,
  },
  parameters: {
    docs: {
      source: {
        code: `<attr-tags/>`,
      },
    },
  },
} as Story<Input>;

export const Repeated = {
  args: {
    header: {
      description: "Hi",
      // Inherited from the native `<h1>`, so not one of the listed attributes.
      class: "big",
    } as any,
    item: [
      { name: "first", count: 1 },
      { name: "second", count: 2 },
    ] as any,
  },
} as Story<Input>;
