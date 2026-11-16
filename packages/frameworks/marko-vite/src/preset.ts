import { hasVitePlugins } from "@storybook/builder-vite";
import { isDocgenEnabled, withDocgenInfo } from "@storybook/marko/docgen";
import type { PresetProperty } from "storybook/internal/types";
import type { Plugin } from "vite";

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

function markoDocgenPlugin(): Plugin {
  return {
    name: "storybook:marko-docgen",
    enforce: "post",
    async transform(code, id, options) {
      // `__docgenInfo` is only read in the browser, from the component itself
      // rather than the `?query` variants @marko/vite also serves.
      if (options?.ssr || !id.endsWith(".marko")) return;
      const result = await withDocgenInfo(code, id);
      if (!result) return;
      for (const dependency of result.dependencies) {
        this.addWatchFile(dependency);
      }
      // Positions are unchanged, so the existing source map still applies.
      return { code: result.code, map: null };
    },
  };
}

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
    plugins: [
      // Ensure @marko/vite included unless already added.
      ...((await hasVitePlugins(viteConfig.plugins || [], ["marko-vite:pre"]))
        ? []
        : [(await import("@marko/vite")).default({ linked: false })]),
      ...((await isDocgenEnabled(storybookConfig))
        ? [markoDocgenPlugin()]
        : []),
    ],
  });
};
