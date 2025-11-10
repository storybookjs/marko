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

export const viteFinal: StorybookConfig["viteFinal"] = async (
  viteConfig,
  storybookConfig,
) => {
  const { mergeConfig } = await import("vite");
  return mergeConfig(viteConfig, {
    resolve: {
      alias: [
        {
          // Fixes https://github.com/storybookjs/storybook/issues/23147
          find: /^~/,
          replacement: "",
        },
      ],
    },
    server:
      storybookConfig.host && viteConfig.server?.allowedHosts === undefined
        ? { allowedHosts: [storybookConfig.host] }
        : undefined,
    plugins:
      // Ensure @marko/vite included unless already added.
      (await hasVitePlugins(viteConfig.plugins || [], ["marko-vite:pre"]))
        ? []
        : [(await import("@marko/vite")).default({ linked: false })],
  });
};
