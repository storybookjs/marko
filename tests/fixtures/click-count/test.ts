import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";

import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialCount, AutomaticAction } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

describe("click-count", () => {
  describe(Default.storyName, () => {
    describe("testing", () => {
      test("can render", async () => {
        await render(Default);
        expect(screen.getByText("Current Count: 0")).toBeTruthy();
        expect(Default.args).not.toHaveProperty("count");
      });
    });

    testPage((getPage) => {
      test(`can increment counter`, async () => {
        const page = await getPage();
        await page.goto(`/iframe.html?id=${Default.id}`);
        const $btn = page.getByText("Click me!");
        const $count = page.getByText("Current Count:");
        await expect($count).toHaveText("Current Count: 0", initialTimeout);
        await $btn.click();
        await expect($count).toHaveText("Current Count: 1");
        await $btn.click();
        await expect($count).toHaveText("Current Count: 2");
      });

      test("supports controls addon", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${Default.id}`);
        const $btn = frame.getByText("Click me!");
        const $count = frame.getByText("Current Count:");
        await page.getByText("Controls", { exact: true }).click(initialTimeout);

        await expect($count).toHaveText("Current Count: 0", initialTimeout);
        await $btn.click();
        await expect($count).toHaveText("Current Count: 1");

        await page.getByText("Set number").click();

        await page.getByPlaceholder("Edit number...").fill("2");
        await expect($count).toHaveText("Current Count: 2");
      });

      test("docs come from Input JSDoc, explicit argTypes win", async () => {
        const page = await getPage();
        await page.goto(`/?path=/story/${Default.id}`);
        await page.getByText("Controls", { exact: true }).click(initialTimeout);
        const panel = page.locator("#storybook-panel-root");

        await expect(
          panel.getByText("What the initial count of the counter should be"),
        ).toBeVisible(initialTimeout);
        await expect(
          panel.getByText("The initial count for the counter."),
        ).not.toBeVisible();

        await expect(
          panel.getByText(
            "Fired each time the internal counter is incremented.",
          ),
        ).toBeVisible();
        await expect(
          panel
            .getByRole("row")
            .filter({ hasText: "What the initial count of the counter" })
            .getByText("0", { exact: true }),
        ).toBeVisible();
      });

      test("can navigate to another story", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
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

  describe(InitialCount.storyName, () => {
    describe("testing", () => {
      test("can render", async () => {
        await render(InitialCount);
        expect(screen.getByText("Current Count: 2")).toBeTruthy();
        expect(InitialCount.args.count).toBe(2);
      });
    });
  });

  describe(AutomaticAction.storyName, () => {
    testPage((getPage) => {
      test("logs a handler without an argType for it", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${AutomaticAction.id}`);
        await frame.getByText("Click me!").click(initialTimeout);
        await page.getByRole("tab", { name: /Actions \d+/ }).click();
        await expect(
          page.getByRole("treeitem", { name: "onIncrement: 1" }),
        ).toBeVisible();

        await page.getByText("Controls", { exact: true }).click();
        const panel = page.locator("#storybook-panel-root");
        await expect(panel.getByText(/^events$/i)).toBeVisible();
      });
    });
  });
});
