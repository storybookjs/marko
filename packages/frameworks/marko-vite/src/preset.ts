import type { PresetProperty } from "@storybook/types";
import { mergeConfig } from "vite";
import { hasVitePlugins } from "@storybook/builder-vite";
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
      name: "@storybook/builder-vite",
      options:
        /* c8 ignore next */
        typeof framework === "string" ? {} : framework.options.builder || {},
    },
    renderer: "@storybook/marko",
  };
};

export const viteFinal: StorybookConfig["viteFinal"] = async (baseConfig) => {
  return mergeConfig(baseConfig, {
    resolve: {
      alias: [
        {
          // Fixes https://github.com/storybookjs/storybook/issues/23147
          find: /^~/,
          replacement: "",
        },
      ],
    },
    plugins:
      // Ensure @marko/vite included unless already added.
      (await hasVitePlugins(baseConfig.plugins || [], ["@marko/vite"]))
        ? []
        : [(await import("@marko/vite")).default({ linked: false })],
  });
};
