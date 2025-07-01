import path from "path";
import type { StorybookConfig } from "@storybook/marko-vite";

export default {
  stories: [path.join(__dirname, "../../../fixtures/**/stories.ts")],
  addons: ["@storybook/addon-links"],
  framework: {
    name: "@storybook/marko-vite",
    options: {},
  },
} satisfies StorybookConfig;
