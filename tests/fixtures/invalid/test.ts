import { test } from "node:test";
import { render } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

test("invalid", async () => {
  await test(Default.storyName, async () => {
    await test("testing", async () => {
      await test("errors when rendering", async () => {
        await expect(render(Default)).rejects.toThrow(
          /Expected a component to be specified in the story/,
        );
      });
    });

    await testPage(async (page) => {
      await test(`shows error display`, async () => {
        await page.goto(`/iframe.html?id=${Default.id}`);
        await expect(
          page.getByRole("heading", {
            name: /Expected a component to be specified in the story/,
          }),
        ).toBeVisible(initialTimeout);
      });
    });
  });
});
