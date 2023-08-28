import path from "path";
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
      name: getAbsolutePath("@storybook/builder-webpack5"),
      options:
        typeof framework === "string" ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath("@storybook/marko"),
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

function getAbsolutePath(pkg: string) {
  return path.dirname(require.resolve(path.join(pkg, "package.json")));
}
