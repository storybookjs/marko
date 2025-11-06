import { test } from "node:test";
import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { HelloWorld, HelloMarko } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

test("split-component", async () => {
  await test(HelloWorld.storyName, async () => {
    await test("testing", async () => {
      test.beforeEach(() => render(HelloWorld));

      await test("can render", async () => {
        expect(
          screen.getByText(`Hello ${HelloWorld.args.name}`),
        ).not.toBeNull();
        expect(HelloWorld.args.name).toBe("World");
      });
    });

    await testPage(async (page) => {
      const frame = page.frameLocator("#storybook-preview-iframe");
      test.beforeEach(async () => {
        await page.goto(`/?path=/story/${HelloWorld.id}`);
      });
      await test("shows correct name", async () => {
        await expect(
          page.getByText(`Hello ${HelloWorld.args.name}`),
        ).toBeVisible(initialTimeout);
      });

      await test("supports controls addon", async () => {
        await page.getByText("Controls").click(initialTimeout);
        await page.getByPlaceholder("Edit string...").fill("Updated");
        await expect(frame.getByText("Hello Updated")).toBeVisible(
          initialTimeout,
        );
      });

      await test("can navigate to another story", async () => {
        await page
          .getByRole("link", { name: "Hello Marko" })
          .or(page.getByRole("button", { name: "Hello Marko" }))
          .click(initialTimeout);
        await expect(frame.getByText("Hello Marko")).toBeVisible(
          initialTimeout,
        );
      });
    });
  });

  await test(HelloMarko.storyName, async () => {
    await test("testing", async () => {
      test.beforeEach(() => render(HelloMarko));

      await test("can render", async () => {
        expect(
          screen.getByText(`Hello ${HelloMarko.args.name}`),
        ).not.toBeNull();
        expect(HelloMarko.args.name).toBe("Marko");
      });
    });

    await testPage(async (page) => {
      test.beforeEach(() => page.goto(`/?path=/story/${HelloMarko.id}`));
      await test("shows correct name", async () => {
        await expect(
          page.getByText(`Hello ${HelloMarko.args.name}`),
        ).toBeVisible(initialTimeout);
      });
    });
  });
});
