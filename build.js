const fs = require("fs");
const path = require("path");
const glob = require("tiny-glob");
const { build } = require("esbuild");
const srcdir = path.resolve("src");

(async () => {
  const markoFiles = await glob("src/{bin,client,server}/**/*.marko");
  const entryPoints = [
    "src/testing.ts",
    "src/standalone.ts",
    ...(await glob("src/{bin,client,server}/**/*.ts")),
  ];

  for (const format of ["esm", "cjs"]) {
    const outdir = path.resolve("dist", format);
    await Promise.all([
      ...markoFiles.map((file) =>
        fs.promises.copyFile(
          file,
          path.join(outdir, path.relative(srcdir, file))
        )
      ),
      build({
        format,
        entryPoints,
        outdir: `dist/${format}`,
        platform: "node",
        target: ["node14"],
      }),
    ]);
  }
})().catch(() => process.exit(1));
