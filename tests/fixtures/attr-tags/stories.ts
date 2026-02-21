import { type Meta, type Story } from "@storybook/marko";
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
    header: {
      description: "An optional header",
      "@": {
        text: {
          description: "The content of the header",
          control: { type: "text" },
        },
      },
    },
    item: {
      description: "Repeatable attribute tag for list items",
      "@": {
        name: {
          description: "The item name",
          control: { type: "text" },
        },
        count: {
          description: "The numerical value of this item",
          control: { type: "number" },
        },
        icon: {
          description: "An optional icon",
          "@": {
            size: {
              changeHandler: true,
              description: "The size of the icon",
              options: ["small", "medium", "large"],
              control: { type: "inline-radio" },
              table: {
                type: { summary: "string" },
              },
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
      text: "hello",
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
