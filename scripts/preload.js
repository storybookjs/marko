require("@marko/compiler/register");

// Setup babel to compile typescript on the fly.
require("@babel/register")({
  babelrc: false,
  configFile: false,
  extensions: [".ts"],
  presets: ["@babel/preset-typescript"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
