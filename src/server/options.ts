import { join } from "path";
import readPkgUp from "read-pkg-up";

export default {
  framework: "marko",
  frameworkPresets: [join(__dirname, "framework-preset-marko")],
  packageJson: readPkgUp.sync({ cwd: __dirname })!.packageJson,
};
