import net from "net";
import cp from "child_process";
import timers from "timers/promises";
import { test } from "node:test";
import { once } from "events";
import * as playwright from "playwright";
import build from "../scripts/build";

type TestFn = (page: playwright.Page) => void | Promise<void>;

const frameworks = ["vite", "webpack"];
const tests: [name: string, fn: TestFn][] = [];

export function testStory(name: string, fn: TestFn) {
  tests.push([name, fn]);
}

test("storybook", async (t) => {
  const [browser] = await Promise.all([playwright.chromium.launch(), build]);
  t.after(() => browser.close());

  await Promise.all(
    frameworks.map(async (framework) => {
      await t.test(framework, async (t) => {
        const port = await getPort();
        const baseURL = `http://localhost:${port}`;
        const proc = cp.spawn(
          "storybook",
          [
            "dev",
            "-p",
            `${port}`,
            "--no-version-updates",
            "--no-open",
            "-c",
            `./tests/frameworks/${framework}/.storybook`,
          ],
          {
            stdio: "ignore",
            // stdio: "inherit",
            env: { ...process.env, PORT: `${port}` },
          },
        );

        const page = await browser.newPage({ baseURL });
        while ((await fetch(baseURL).catch(noop))?.status !== 200) {
          await timers.setTimeout(100);
        }

        t.after(() => {
          const exit = once(proc, "exit");
          proc.kill();
          return Promise.all([page.close(), exit]);
        });

        await Promise.all(
          tests.map(([name, fn]) => t.test(name, () => fn(page))),
        );
      });
    }),
  );
});

function getPort() {
  return new Promise<number>((resolve, reject) => {
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

function noop() {}
