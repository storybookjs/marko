import * as assert from "assert";
import type * as playwright from "playwright";
import { render, screen } from "@marko/testing-library";
import * as stories from "./stories";
import { composeStories } from "../../testing";

const id = "clickcount--default";

describe(stories.default.title!, () => {
  describe("iframe", () => {
    before(async () => {
      await page.goto(`http://localhost:8080/iframe.html?id=${id}`);
    });

    it("can increment counter", async () => {
      const $count = await page.waitForSelector("text=Current Count:");
      assert.strictEqual(await $count.innerText(), "Current Count: 0");

      await page.click("text=Click me!");
      assert.strictEqual(await $count.innerText(), "Current Count: 1");

      await page.click("text=Click me!");
      assert.strictEqual(await $count.innerText(), "Current Count: 2");
    });
  });

  describe("addons", () => {
    let frame: playwright.Frame;

    before(async () => {
      await page.goto(`http://localhost:8080/?path=/story/${id}`);
      await page.waitForSelector("#storybook-preview-iframe");
      frame = page.frame({ name: "storybook-preview-iframe" })!;
    });

    it("supports controls addon", async () => {
      const $count = await frame.waitForSelector("text=Current Count:");
      await page.click("text=Controls");

      assert.ok(await page.waitForSelector("text=count"));
      assert.ok(await page.waitForSelector("text=onIncrement"));
      assert.strictEqual(await $count.innerText(), "Current Count: 0");

      await frame.click("text=Click me!");
      assert.strictEqual(await $count.innerText(), "Current Count: 1");

      await page.click("text=Set number");
      await page.fill('[placeholder="Edit number..."]', "2");
      assert.strictEqual(await $count.innerText(), "Current Count: 2");

      await page.click("text=NameControl >> button");
      assert.strictEqual(await $count.innerText(), "Current Count: 0");
    });

    it("supports actions addon", async () => {
      await page.click("text=Actions");
      await frame.click("text=Click me!");
      assert.ok(
        await page.waitForSelector(
          `li[role="treeitem"] div:has-text("increment from default: 1")`
        )
      );
    });

    it("can navigate to another story", async () => {
      await Promise.all([
        frame.waitForNavigation(),
        page.click("text=Initial Count"),
      ]);
      const $count = await frame.waitForSelector("text=Current Count:");

      assert.strictEqual(await $count.innerText(), "Current Count: 2");

      await frame.click("text=Click me!");
      assert.strictEqual(await $count.innerText(), "Current Count: 3");

      await frame.click("text=Click me!");
      assert.strictEqual(await $count.innerText(), "Current Count: 4");

      assert.ok(
        await page.waitForSelector(
          `li[role="treeitem"] div:has-text("increment from initial count: 4")`
        )
      );
    });
  });

  describe("testing", () => {
    const { Default, InitialCount } = composeStories(stories);

    it("can render the default story", async () => {
      await render(Default);
      assert.ok(screen.getByText("Current Count: 0"));
      assert.strictEqual(Default.args.count, undefined);
    });

    it("can render the initial count story", async () => {
      await render(InitialCount);
      assert.ok(screen.getByText("Current Count: 2"));
      assert.strictEqual(InitialCount.args.count, 2);
    });
  });
});
