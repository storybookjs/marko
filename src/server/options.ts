import fs from "fs";
import path from "path";
import findUp from "escalade/sync";

const packageJsonFile = findUp(
  __dirname,
  (_, names) => names.includes("package.json") && "package.json"
);

export default {
  framework: "marko",
  frameworkPresets: [path.join(__dirname, "framework-preset-marko")],
  packageJson:
    packageJsonFile && JSON.parse(fs.readFileSync(packageJsonFile, "utf-8")),
};
