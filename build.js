const glob = require("tiny-glob");
const { build } = require("esbuild");

(async () => {
  const entryPoints = [
    "src/testing.ts",
    "src/standalone.ts",
    ...(await glob("src/{bin,client,server}/**/*.ts")),
  ];

  for (const format of ["esm", "cjs"]) {
    await build({
      format,
      entryPoints,
      outdir: `dist/${format}`,
      platform: "node",
      target: ["node14"],
    });
  }
})().catch(() => process.exit(1));
