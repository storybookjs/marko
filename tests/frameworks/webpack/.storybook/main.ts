import path from "path";
import type { StorybookConfig } from "@storybook/marko-webpack";

export default {
  stories: [path.join(process.cwd(), "../../fixtures/**/stories.ts")],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-webpack5-compiler-babel",
  ],
  framework: {
    name: "@storybook/marko-webpack",
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
