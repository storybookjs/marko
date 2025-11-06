import cp from "child_process";
import { once } from "events";
import fs from "fs/promises";
import net from "net";
import { after, test } from "node:test";
import path from "path";
import timers from "timers/promises";
import * as playwright from "playwright";

const checkCoverage = !!process.env.NODE_V8_COVERAGE;
const root = path.join(__dirname, "..");
const frameworks = ["vite", "webpack"] as const;
const pages = new Map<
  (typeof frameworks)[number],
  Promise<{ page: playwright.Page; proc: cp.ChildProcess }>
>();
let browser: playwright.Browser | undefined;

after(async () => {
  if (!browser) return;

  await Promise.all(
    Array.from(pages.values(), async (pending) => {
      const { proc, page } = await pending;
      const killedPromise = once(proc, "exit");
      proc.kill();

      if (checkCoverage && page) {
        await fs.writeFile(
          path.join(
            root,
            "coverage",
            "tmp",
            `coverage-${Date.now().toString(16)}-${Math.random()
              .toString(16)
              .slice(2)}.json`,
          ),
          JSON.stringify({
            result: (await page.coverage.stopJSCoverage())
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .map(({ url, source, ...item }) => {
                const filename = url.replace(/^.*[/\\]@fs([\\/])/, "$1");
                return (
                  filename !== url && {
                    ...item,
                    url: filename,
                  }
                );
              })
              .filter(Boolean),
          }),
        );
      }

      await killedPromise;
    }),
  );

  await browser.close();
});

export async function testPage(fn: (page: playwright.Page) => unknown) {
  for (const framework of frameworks) {
    await test(framework, async () => {
      await fn(await getPage(framework));
    });
  }
}

async function getPage(framework: (typeof frameworks)[number]) {
  let cached = pages.get(framework);
  if (!cached) pages.set(framework, (cached = startPage(framework)));
  return (await cached).page;
}

async function startPage(framework: (typeof frameworks)[number]) {
  browser ||= await playwright.chromium.launch();

  const port = await getPort();
  const baseURL = `http://localhost:${port}`;
  const pendingPage = browser.newPage({ baseURL });
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

  while ((await fetch(baseURL).catch(noop))?.status !== 200) {
    await timers.setTimeout(100);
  }

  const page = await pendingPage;
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
  await timers.setTimeout(5000);

  if (checkCoverage) {
    await page.coverage.startJSCoverage({
      reportAnonymousScripts: false,
      resetOnNavigation: false,
    });
  }

  return {
    page,
    proc,
  };
}

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
