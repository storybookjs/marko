import cp from "node:child_process";
import { once } from "node:events";
import net from "node:net";
import path from "node:path";
import timers from "node:timers/promises";

import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    ports: Record<string, number>;
  }
}
const root = path.resolve(import.meta.dirname, "..");
const procs: cp.ChildProcess[] = [];

export async function setup(project: TestProject) {
  const ports: Record<string, number> = {};
  await Promise.all(
    ["vite", "webpack"].map(async (framework) => {
      const port = (ports[framework] = await getPort());
      const baseURL = `http://localhost:${port}`;
      const startTime = Date.now();
      const fwDir = path.join(root, "tests", "frameworks", framework);
      const proc = cp.spawn(
        "storybook",
        [
          "dev",
          "-p",
          `${port}`,
          "--no-version-updates",
          "--no-open",
          "-c",
          path.join(fwDir, ".storybook"),
        ],
        {
          // stdio: "inherit",
          stdio: "ignore",
          cwd: fwDir,
        },
      );

      procs.push(proc);

      while ((await fetch(baseURL).catch(() => {}))?.status !== 200) {
        if (Date.now() - startTime > 120_000) {
          proc.kill();
          throw new Error(
            `${framework} storybook server did not start within 120s`,
          );
        }
        await timers.setTimeout(100);
      }
    }),
  );

  project.provide("ports", ports);
}

export async function teardown() {
  await Promise.all(
    procs.map(async (proc) => {
      proc.kill();
      await once(proc, "exit");
    }),
  );
}

function getPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server
      .unref()
      .on("error", reject)
      .listen(0, () => {
        const { port } = server.address() as net.AddressInfo;
        server.close(() => resolve(port));
      });
  });
}
