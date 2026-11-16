import type { Preview } from "@storybook/marko";

export default {
  tags: ["autodocs"],
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
} satisfies Preview;
