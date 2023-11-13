import assert from "node:assert/strict";
import { test } from "node:test";
import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialCount } = composeStories(stories);

test("click-count", async () => {
  await test(Default.storyName, async () => {
    await test("testing", async () => {
      await test("can render", async () => {
        await render(Default);
        assert.ok(screen.getByText("Current Count: 0"));
        Default.args.count;
        assert.ok(!("count" in Default.args));
      });
    });

    await testPage(async (page) => {
      await test(`can increment counter`, async () => {
        await page.goto(`/iframe.html?id=${Default.id}`);
        const $btn = page.getByText("Click me!");
        const $count = page.getByText("Current Count:");
        assert.equal(await $count.textContent(), "Current Count: 0");
        await $btn.click();
        assert.equal(await $count.textContent(), "Current Count: 1");
        await $btn.click();
        assert.equal(await $count.textContent(), "Current Count: 2");
      });

      await test("supports controls addon", async () => {
        await page.goto(`/?path=/story/${Default.id}`);
        await page.waitForSelector("#storybook-preview-iframe");
        const frame = (await (
          await page.waitForSelector("#storybook-preview-iframe")
        ).contentFrame())!;
        await frame.waitForLoadState();
        const $count = await frame.waitForSelector("text=Current Count:");
        await page.click("text=Controls");

        assert.ok(await page.waitForSelector("text=count"));
        assert.ok(await page.waitForSelector("text=onIncrement"));
        assert.equal(await $count.innerText(), "Current Count: 0");

        await frame.click("text=Click me!");
        assert.equal(await $count.innerText(), "Current Count: 1");

        await page.click("text=Set number");
        await page.fill('[placeholder="Edit number..."]', "2");
        assert.equal(await $count.innerText(), "Current Count: 2");

        await page.click("text=NameControl >> button");
        assert.equal(await $count.innerText(), "Current Count: 0");
      });

      await test("can navigate to another story", async () => {
        await page.goto(`/?path=/story/${Default.id}`);
        await page.waitForSelector("#storybook-preview-iframe");
        const frame = (await (
          await page.waitForSelector("#storybook-preview-iframe")
        ).contentFrame())!;
        await frame.waitForLoadState();
        await page.click("text=Initial Count");

        const $count = await frame.waitForSelector("text=Current Count:");

        assert.equal(await $count.innerText(), "Current Count: 2");

        await frame.click("text=Click me!");
        assert.equal(await $count.innerText(), "Current Count: 3");

        await frame.click("text=Click me!");
        assert.equal(await $count.innerText(), "Current Count: 4");

        await page.getByRole("tab", { name: /Actions \d+/ }).click();

        assert.ok(
          await page.waitForSelector(
            `li[role="treeitem"] div:has-text("increment from initial count: 4")`,
          ),
        );
      });
    });
  });

  await test(InitialCount.storyName, async () => {
    await test("testing", async () => {
      await test("can render", async () => {
        await render(InitialCount);
        assert.ok(screen.getByText("Current Count: 2"));
        assert.equal(InitialCount.args.count, 2);
      });
    });

    await test("can render", async () => {
      await render(InitialCount);
      assert.ok(screen.getByText("Current Count: 2"));
      assert.equal(InitialCount.args.count, 2);
    });
  });
});
