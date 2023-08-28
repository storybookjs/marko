// Register tsconfig aliases so that we always load source files instead of dist files.
const path = require("path");
const tsconfigPaths = require("tsconfig-paths");

for (const dir of [
  path.join(__dirname, "../packages/renderers/marko"),
  path.join(__dirname, "../packages/frameworks/marko-webpack"),
]) {
  const {
    compilerOptions: { baseUrl, paths },
  } = require(path.join(dir, "tsconfig.json"));
  if (paths) {
    tsconfigPaths.register({
      cwd: dir,
      baseUrl,
      paths,
    });
  }
}

// Setup babel to compile typescript on the fly.
require("@babel/register")({
  babelrc: false,
  configFile: false,
  extensions: [".ts"],
  presets: ["@babel/preset-typescript"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
