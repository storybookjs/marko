import fs from "fs";
import path from "path";
import glob from "globby";
import { build } from "esbuild";

(async () => {
  const assets = [];
  const entryPoints = [];
  const srcdir = path.resolve("src");
  const files = await glob(["**/*", "!**/*.d.ts", "!**/__tests__"], {
    cwd: srcdir,
  });

  for (const file of files) {
    if (path.extname(file) === ".ts") {
      entryPoints.push(path.resolve(srcdir, file));
    } else {
      assets.push(file);
    }
  }

  for (const format of ["esm", "cjs"] as const) {
    const outdir = path.resolve("dist", format);
    await Promise.all([
      Promise.all(
        assets.map(async (file) => {
          const distFile = path.join(outdir, file);
          await fs.promises.mkdir(path.dirname(distFile), { recursive: true });
          await fs.promises.copyFile(path.join(srcdir, file), distFile);
        })
      ),
      build({
        outdir,
        format,
        entryPoints,
        outbase: srcdir,
        platform: "node",
        target: ["node14"],
      }),
    ]);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
