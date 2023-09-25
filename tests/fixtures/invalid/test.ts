import assert from "node:assert/strict";
import { test } from "node:test";
import { composeStories } from "@storybook/marko";
import { render } from "@marko/testing-library";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default } = composeStories(stories);

test("invalid", async () => {
  await test(Default.storyName, async () => {
    await test("testing", async () => {
      await test("errors when rendering", async () => {
        await assert.rejects(render(Default));
      });
    });

    await testPage(async (page) => {
      await test(`shows error display`, async () => {
        await page.goto(`/iframe.html?id=${Default.id}`);
        assert.ok(
          await page.waitForSelector(
            `text=Expected a component to be specified in the story`,
          ),
        );
      });
    });
  });
});
