import { hasVitePlugins } from "@storybook/builder-vite";
import type { PresetProperty } from "storybook/internal/types";
import type { StorybookConfig } from "./types";

export const core: PresetProperty<"core"> = async (config, options) => {
  const framework = await options.presets.apply("framework");

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
  const { mergeConfig } = await import("vite");
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
      (await hasVitePlugins(baseConfig.plugins || [], ["marko-vite:pre"]))
        ? []
        : [(await import("@marko/vite")).default({ linked: false })],
  });
};
