import { test } from "node:test";
import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialCount } = composeStories(stories);
const initialTimeout = { timeout: 30000 };

test("click-count", async () => {
  await test(Default.storyName, async () => {
    await test("testing", async () => {
      await test("can render", async () => {
        await render(Default);
        expect(screen.getByText("Current Count: 0")).toBeTruthy();
        expect(Default.args).not.toHaveProperty("count");
      });
    });

    await testPage(async (page) => {
      const frame = page.frameLocator("#storybook-preview-iframe");

      await test(`can increment counter`, async () => {
        await page.goto(`/iframe.html?id=${Default.id}`);
        const $btn = page.getByText("Click me!");
        const $count = page.getByText("Current Count:");
        await expect($count).toHaveText("Current Count: 0", initialTimeout);
        await $btn.click();
        await expect($count).toHaveText("Current Count: 1");
        await $btn.click();
        await expect($count).toHaveText("Current Count: 2");
      });

      await test("supports controls addon", async () => {
        await page.goto(`/?path=/story/${Default.id}`);
        const $btn = frame.getByText("Click me!");
        const $count = frame.getByText("Current Count:");
        await page.getByText("Controls").click(initialTimeout);

        await expect($count).toHaveText("Current Count: 0", initialTimeout);
        await $btn.click();
        await expect($count).toHaveText("Current Count: 1");

        await page.getByText("Set number").click();

        await page.getByPlaceholder("Edit number...").fill("2");
        await expect($count).toHaveText("Current Count: 2");

        await page.getByText("NameControl").getByRole("button").click();
        await expect($count).toHaveText("Current Count: 0");
      });

      await test("can navigate to another story", async () => {
        await page.goto(`/?path=/story/${Default.id}`);
        await page.getByText("Initial Count").click(initialTimeout);

        const $btn = frame.getByText("Click me!");
        const $count = frame.getByText("Current Count:");

        await expect($count).toHaveText("Current Count: 2", initialTimeout);
        await $btn.click();

        await expect($count).toHaveText("Current Count: 3");
        await $btn.click();

        await expect($count).toHaveText("Current Count: 4");

        await page.getByRole("tab", { name: /Actions \d+/ }).click();

        await expect(
          page.getByRole("treeitem", {
            name: "increment from initial count: 4",
          }),
        ).toBeVisible();
      });
    });
  });

  await test(InitialCount.storyName, async () => {
    await test("testing", async () => {
      await test("can render", async () => {
        await render(InitialCount);
        expect(screen.getByText("Current Count: 2")).toBeTruthy();
        expect(InitialCount.args.count).toBe(2);
      });
    });
  });
});
