import fs from "fs";
import path from "path";
import { type BuildOptions, build } from "esbuild";
import glob from "fast-glob";

export default (async () => {
  for (const packageDir of [
    path.join(__dirname, "../packages/renderers/marko"),
    path.join(__dirname, "../packages/frameworks/marko-vite"),
    path.join(__dirname, "../packages/frameworks/marko-webpack"),
  ]) {
    const entryPoints: string[] = [];
    const srcdir = path.resolve(packageDir, "src");
    const outdir = path.resolve(packageDir, "dist");
    const files = glob.stream(["**", "!*.d.ts"], {
      cwd: srcdir,
    }) as AsyncIterable<string>;

    for await (const file of files) {
      if (path.extname(file) === ".ts") {
        entryPoints.push(path.resolve(srcdir, file));
      } else {
        const outfile = path.join(outdir, file);
        await fs.promises.mkdir(path.dirname(outfile), { recursive: true });
        await fs.promises.copyFile(path.join(srcdir, file), outfile);
      }
    }

    const opts: BuildOptions = {
      outdir,
      entryPoints,
      outbase: srcdir,
      platform: "node",
      sourcemap: process.env.NODE_V8_COVERAGE ? "inline" : false,
      define: {
        "process.env.NODE_ENV": "'production'",
      },
    };

    await Promise.all([
      build({
        ...opts,
        format: "cjs",
        define: {
          ...opts.define,
          "import.meta.dirname": "__dirname",
          "import.meta.filename": "__filename",
        },
      }),
      build({
        ...opts,
        format: "esm",
        bundle: true,
        splitting: true,
        outExtension: { ".js": ".mjs" },
        packages: "external",
      }),
    ]);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
