import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { HelloWorld, HelloMarko } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

describe("split-component", () => {
  describe(HelloWorld.storyName, () => {
    describe("testing", () => {
      beforeEach(() => render(HelloWorld));

      test("can render", async () => {
        expect(
          screen.getByText(`Hello ${HelloWorld.args.name}`),
        ).not.toBeNull();
        expect(HelloWorld.args.name).toBe("World");
      });
    });

    testPage((getPage) => {
      beforeEach(async () => {
        const page = await getPage();
        await page.goto(`/?path=/story/${HelloWorld.id}`);
      });

      test("shows correct name", async () => {
        const page = await getPage();
        await expect(
          page.getByText(`Hello ${HelloWorld.args.name}`),
        ).toBeVisible(initialTimeout);
      });

      test("supports controls addon", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.getByText("Controls", { exact: true }).click(initialTimeout);
        await page.getByPlaceholder("Edit string...").fill("Updated");
        await expect(frame.getByText("Hello Updated")).toBeVisible(
          initialTimeout,
        );
      });

      test("can navigate to another story", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
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

  describe(HelloMarko.storyName, () => {
    describe("testing", () => {
      beforeEach(() => render(HelloMarko));

      test("can render", async () => {
        expect(
          screen.getByText(`Hello ${HelloMarko.args.name}`),
        ).not.toBeNull();
        expect(HelloMarko.args.name).toBe("Marko");
      });
    });

    testPage((getPage) => {
      beforeEach(async () => {
        const page = await getPage();
        await page.goto(`/?path=/story/${HelloMarko.id}`);
      });

      test("shows correct name", async () => {
        const page = await getPage();
        await expect(
          page.getByText(`Hello ${HelloMarko.args.name}`),
        ).toBeVisible(initialTimeout);
      });
    });
  });
});
