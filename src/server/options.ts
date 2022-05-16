import type { LoadOptions } from "@storybook/core-common";
import fs from "fs";
import findUp from "escalade/sync";

const packageJsonFile = findUp(
  __dirname,
  (_, names) => names.includes("package.json") && "package.json"
);

export default {
  framework: "marko",
  frameworkPath: "@storybook/marko",
  frameworkPresets: [require.resolve("./framework-preset-marko")],
  packageJson:
    packageJsonFile && JSON.parse(fs.readFileSync(packageJsonFile, "utf-8")),
} as LoadOptions;
