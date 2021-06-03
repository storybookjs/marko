import type { Configuration } from "webpack";
import type { TransformOptions } from "@babel/core";
import path from "path";
export = {
  stories: ["../**/stories.ts"],
  addons: ["@storybook/addon-essentials"],
  core: { builder: "webpack5" },
  features: { postcss: false },
  webpackFinal: async (config: Configuration) => {
    // Use the non bundled version of @storybook/marko for our tests.
    config.resolve.alias["@storybook/marko"] = path.join(
      __dirname,
      "../../client/index.ts"
    );

    config.stats = {
      errorDetails: true,
    };

    if (process.env.NYC_CONFIG) {
      config.devtool = "inline-nosources-source-map";
      config.module.rules.push({
        enforce: "post",
        type: "javascript/auto",
        exclude: /__tests__/,
        include: path.join(__dirname, "../.."),
        loader: "coverage-istanbul-loader",
      });
    }

    return config;
  },
};
