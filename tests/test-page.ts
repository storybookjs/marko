import * as playwright from "playwright";
import { inject } from "vitest";

const frameworks = ["vite", "webpack"] as const;
const pages = new Map<string, Promise<playwright.Page>>();
let browser: playwright.Browser | undefined;
let pendingBrowser: Promise<playwright.Browser> | undefined;

afterAll(() => browser?.close());

export function testPage(
  fn: (getPage: () => Promise<playwright.Page>) => void,
) {
  for (const framework of frameworks) {
    let page: Promise<playwright.Page>;
    describe(framework, () => {
      beforeAll(() => (page = getPage(framework)), 60_000);
      fn(() => page);
    });
  }
}

function getPage(framework: (typeof frameworks)[number]) {
  let pendingPage = pages.get(framework);
  if (!pendingPage) {
    pendingPage = createPage(framework);
    pages.set(framework, pendingPage);
  }

  return pendingPage;
}

async function createPage(framework: (typeof frameworks)[number]) {
  const port = inject("ports")[framework];
  const page = await (browser ||= await (pendingBrowser ||=
    playwright.chromium.launch())).newPage({
    baseURL: `http://localhost:${port}`,
  });

  page.setDefaultTimeout(60_000);
  page.setDefaultNavigationTimeout(60_000);
  return page;
}
