import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";

import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialValues, Repeated } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

describe("attr-tags", () => {
  describe(Default.storyName, () => {
    describe("testing", () => {
      test("can render with no args - attributes passed through", async () => {
        await render(Default);
        expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
          "(No Header)",
        );
        expect(Default.args).not.toHaveProperty("header");
        expect(Default.args).not.toHaveProperty("item");
      });
    });

    testPage((getPage) => {
      test("renders default story in iframe", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${Default.id}`);
        await expect(
          frame.getByRole("heading", { name: "(No Header)" }),
        ).toBeVisible(initialTimeout);
      });
    });
  });

  describe(InitialValues.storyName, () => {
    describe("testing", () => {
      test("InitialValues story has expected args shape", async () => {
        expect(InitialValues.args?.header).toBeDefined();
        expect(
          (InitialValues.args?.header as unknown as { description: string })
            .description,
        ).toBe("Hello");
        expect(InitialValues.args?.item).toBeDefined();
        const item = InitialValues.args?.item as {
          name: string;
          count: number;
          icon?: { size: string };
        };
        expect(item.name).toBe("world");
        expect(item.count).toBe(5);
        expect(item.icon?.size).toBe("small");
      });
    });

    testPage((getPage) => {
      test("all attributes passed through to DOM in story", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${InitialValues.id}`);
        await expect(frame.getByRole("heading", { name: "Hello" })).toBeVisible(
          initialTimeout,
        );
        await expect(frame.getByText(/world \(5\)/)).toBeVisible(
          initialTimeout,
        );
        const storyButton = frame.getByRole("button", { name: "🙂" });
        await expect(storyButton).toBeVisible(initialTimeout);
        await expect(storyButton).toHaveCSS("font-size", "8px", initialTimeout);
      });

      test("controllable icon size - control updates story", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${InitialValues.id}`);
        await page.getByText("Controls", { exact: true }).click(initialTimeout);

        await expect(frame.getByText("Hello")).toBeVisible(initialTimeout);
        await expect(frame.getByText(/world \(5\)/)).toBeVisible(
          initialTimeout,
        );

        const storyButton = frame.getByRole("button", { name: "🙂" });
        await expect(storyButton).toBeVisible(initialTimeout);
        await expect(storyButton).toHaveCSS("font-size", "8px", initialTimeout);

        const panel = page.locator("#storybook-panel-root");
        const sizeRadios = panel.getByRole("radio", {
          name: /small|medium|large/i,
        });
        await sizeRadios.first().waitFor({ state: "visible", timeout: 10000 });

        await expect(
          panel.getByText("The content of the header."),
        ).toBeVisible();
        await expect(panel.getByText("The item name.")).toBeVisible();
        await expect(panel.getByText("The size of the icon.")).toBeVisible();

        await panel.getByRole("radio", { name: /medium/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "16px");

        await panel.getByRole("radio", { name: /large/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "32px");

        await panel.getByRole("radio", { name: /small/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "8px");
        await expect(panel.getByText("size, sizeChange")).toBeVisible();
        await storyButton.click();
        await expect(storyButton).toHaveCSS("font-size", "16px");
        await expect(
          panel.getByRole("radio", { name: /medium/i }),
        ).toBeChecked();
      });
    });
  });

  describe(Repeated.storyName, () => {
    describe("testing", () => {
      test("renders repeated items and inherited attributes", async () => {
        await render(Repeated);
        expect(screen.getByRole("heading", { level: 1 }).className).toBe("big");
        expect(screen.getByText(/first \(1\)/)).toBeTruthy();
        expect(screen.getByText(/second \(2\)/)).toBeTruthy();
      });
    });

    testPage((getPage) => {
      test("renders repeated items and inherited attributes", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${Repeated.id}`);
        await expect(frame.getByText(/second \(2\)/)).toBeVisible(
          initialTimeout,
        );
        await expect(frame.getByText(/first \(1\)/)).toBeVisible();
        await expect(frame.getByRole("heading", { name: "Hi" })).toHaveClass(
          "big",
        );
      });

      test("a nested control leaves repeated items alone", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${Repeated.id}`);
        await page.getByText("Controls", { exact: true }).click(initialTimeout);
        const panel = page.locator("#storybook-panel-root");
        const nameRow = panel.getByRole("row").filter({ hasText: /^name\b/ });
        await nameRow
          .getByRole("button", { name: /set string/i })
          .click(initialTimeout);
        await nameRow.getByRole("textbox").fill("changed");
        // Then edit the single `header`, so there is a render to wait for.
        const descriptionRow = panel
          .getByRole("row")
          .filter({ hasText: /^description\b/ });
        await descriptionRow
          .getByRole("button", { name: /set string/i })
          .click();
        await descriptionRow.getByRole("textbox").fill("Edited");
        await expect(
          frame.getByRole("heading", { name: "Edited" }),
        ).toHaveClass("big");
        await expect(frame.getByText(/first \(1\)/)).toBeVisible();
        await expect(frame.getByText(/second \(2\)/)).toBeVisible();
      });
    });
  });
});
