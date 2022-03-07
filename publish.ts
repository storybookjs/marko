import fs from "fs";
import path from "path";
import glob from "fast-glob";

const HOOK = process.argv.at(-1) === "pre" ? "pre" : "post";
updatePackageExports();

/**
 * Generates the `exports` field in the `package.json`.
 * This includes auto adding conditions to load `.mjs` vs `.js` and
 * supports the `browser` condition by looking for `-browser.ts` files.
 */
async function updatePackageExports() {
  await updateJSON("package.json", async (data) => {
    if (HOOK === "post") {
      return {
        ...data,
        exports: undefined,
      };
    }

    const exportMap: any = {
      ".": {
        import: "./dist/client/index.mjs",
        default: "./dist/client/index.js",
      },
      "./bin/build.js": "./bin/build.js",
      "./bin/index.js": "./bin/index.js",
    };
    const files = glob.stream([
      "dist/**",
      "!*.d.ts",
      "!**/__tests__",
      "!**/*.tsbuildinfo",
    ]) as AsyncIterable<string>;

    for await (const file of files) {
      const relativeFile = `./${file}`;
      const ext = path.extname(file);
      if (ext === ".js") {
        const base = relativeFile.slice(0, -ext.length);
        const jsFile = `${base}.js`;
        const conditions =
          (exportMap[base] =
          exportMap[jsFile] =
            {
              import: `${base}.mjs`,
              default: jsFile,
            });

        if (path.basename(file, ext) === "index") {
          exportMap[base.slice(0, -"/index".length)] = conditions;
        }
      } else {
        exportMap[relativeFile] = relativeFile;
      }
    }

    return {
      ...data,
      exports: exportMap,
    };
  });
}

async function updateJSON(
  file: string,
  update: (val: object) => Promise<unknown>
) {
  await updateText(file, async (src) =>
    JSON.stringify(await update(JSON.parse(src)), null, 2)
  );
}

async function updateText(
  file: string,
  update: (val: string) => Promise<string>
) {
  await fs.promises.writeFile(
    file,
    await update(await fs.promises.readFile(file, "utf-8"))
  );
}
