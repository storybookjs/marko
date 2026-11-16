import type { StorybookConfig } from "@storybook/marko-vite";
import path from "path";

export default {
  stories: [path.join(process.cwd(), "../../fixtures/**/stories.ts")],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/marko-vite",
    options: {},
  },
} satisfies StorybookConfig;
