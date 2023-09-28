import assert from "node:assert/strict";
import { test } from "node:test";
import type { Frame } from "playwright";
import { render, screen } from "@marko/testing-library";
import { testPage } from "../../test-page";
import * as stories from "./stories";
import { composeStories } from "@storybook/marko";

const { HelloWorld, HelloMarko } = composeStories(stories);

test("split-component", async () => {
  await test(HelloWorld.storyName, async () => {
    await test("testing", async () => {
      test.beforeEach(() => render(HelloWorld));

      await test("can render", async () => {
        assert.ok(screen.getByText("Hello World"));
        assert.equal(HelloWorld.args.name, "World");
      });
    });

    await testPage(async (page) => {
      let frame: Frame;
      test.beforeEach(async () => {
        await page.goto(`/?path=/story/${HelloWorld.id}`);
        await page.waitForSelector("#storybook-preview-iframe");
        frame = (await (
          await page.waitForSelector("#storybook-preview-iframe")
        ).contentFrame())!;
        await frame.waitForLoadState();
      });
      await test("shows correct name", async () => {
        assert.equal(await page.getByText("Hello World").isVisible(), true);
      });

      await test("supports controls addon", async () => {
        await page.waitForTimeout(100);
        await page.click("text=Controls");
        await page.fill('textarea:has-text("World")', "Updated");
        assert.ok(await frame.waitForSelector('div:has-text("Hello Updated")'));
      });

      await test("can navigate to another story", async () => {
        await page.click('a:has-text("Hello Marko")');
        assert.ok(await frame.waitForSelector('div:has-text("Hello Marko")'));
      });
    });
  });

  await test(HelloMarko.storyName, async () => {
    await test("testing", async () => {
      test.beforeEach(() => render(HelloMarko));

      await test("can render", async () => {
        assert.ok(screen.getByText("Hello Marko"));
        assert.equal(HelloMarko.args.name, "Marko");
      });
    });

    await testPage(async (page) => {
      test.beforeEach(() => page.goto(`/?path=/story/${HelloMarko.id}`));
      await test("shows correct name", async () => {
        assert.equal(await page.getByText("Hello World").isVisible(), true);
      });
    });
  });
});
