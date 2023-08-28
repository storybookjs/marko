// import path from "path";
import type { PresetProperty } from "@storybook/types";
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
      name: getAbsolutePath("@storybook/builder-vite"),
      options:
        typeof framework === "string" ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath("@storybook/marko"),
  };
};

export const viteFinal: StorybookConfig["viteFinal"] = async (baseConfig) => {
  const { plugins = [] } = baseConfig;
  if (!(await hasVitePlugins(plugins, ["@marko/vite"]))) {
    const { default: markoPlugin } = await import("@marko/vite");
    plugins.push(markoPlugin({ linked: false }));
  }
  return baseConfig;
};

function getAbsolutePath(pkg: string) {
  return pkg;
  // return path.dirname(require.resolve(path.join(pkg, "package.json")));
}
