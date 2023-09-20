import type { PresetProperty } from "@storybook/types";
import type { StorybookConfig } from "./types";

export const core: PresetProperty<"core", StorybookConfig> = async (
  config,
  options,
) => {
  const framework =
    await options.presets.apply<StorybookConfig["framework"]>("framework");

  return {
    ...config,
    builder: {
      name: "@storybook/builder-webpack5",
      options:
        typeof framework === "string" ? {} : framework.options.builder || {},
    },
    renderer: "@storybook/marko",
  };
};

export const webpackFinal: StorybookConfig["webpackFinal"] = async (
  baseConfig,
) => {
  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [
        ...baseConfig.module!.rules!,
        {
          test: /\.marko$/,
          loader: require.resolve("@marko/webpack/loader"),
        },
      ],
    },
    resolve: {
      ...baseConfig.resolve,
      extensions: [...baseConfig.resolve!.extensions!, ".marko"],
    },
  };
};
