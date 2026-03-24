import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialValues } = composeStories(stories);
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

        await panel.getByRole("radio", { name: /medium/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "16px");

        await panel.getByRole("radio", { name: /large/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "32px");

        await panel.getByRole("radio", { name: /small/i }).click();
        await expect(storyButton).toHaveCSS("font-size", "8px");
      });
    });
  });
});
