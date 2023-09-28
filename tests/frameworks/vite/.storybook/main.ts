import path from "path";
import type { StorybookConfig } from "@storybook/marko-vite";

export default {
  stories: [path.join(__dirname, "../../../fixtures/**/stories.ts")],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/marko-vite",
    options: {},
  },
  babel(config) {
    config.babelrc = false;
    config.configFile = false;
    config.presets ??= [];
    config.presets.push(require.resolve("@babel/preset-typescript"));
    return config;
  },
} satisfies StorybookConfig;
