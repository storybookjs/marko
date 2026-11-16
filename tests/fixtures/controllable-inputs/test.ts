import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { renderToCanvas } from "@storybook/marko/dist/entry-preview.mjs";
import { expect } from "playwright/test";

import { testPage } from "../../test-page";
import Controllable from "./index.marko";
import * as stories from "./stories";

const { Default, InitialValues } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

describe("controllable-inputs", () => {
  describe(Default.storyName, () => {
    describe("testing", () => {
      test("can render with no initial args", async () => {
        await render(Default);
        expect(screen.getByRole("button", { name: "OFF" })).toBeTruthy();
        const textbox = screen.getByRole("textbox") as HTMLInputElement;
        expect(textbox.value).toBe("");
        expect(Default.args).not.toHaveProperty("value");
        expect(Default.args).not.toHaveProperty("pressed");
        expect(Default.args).not.toHaveProperty("color");
      });
    });

    testPage((getPage) => {
      test("when value arg is unset, typing in input does not sync to args", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${Default.id}`);
        const storyTextbox = frame.getByRole("textbox");

        await expect(storyTextbox).toHaveValue("", initialTimeout);
        await storyTextbox.fill("hello");
        await expect(storyTextbox).toHaveValue("hello");

        await page.reload();
        await expect(frame.getByRole("textbox")).toHaveValue(
          "",
          initialTimeout,
        );
      });
    });
  });

  describe(InitialValues.storyName, () => {
    testPage((getPage) => {
      test("args and display stay in sync when arg is set", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${InitialValues.id}`);
        await page.getByText("Controls", { exact: true }).click(initialTimeout);
        const panel = page.locator("#storybook-panel-root");
        const controlValue = panel.getByPlaceholder("Edit string...");
        const storyTextbox = frame.getByRole("textbox");

        await expect(storyTextbox).toHaveValue("Marko!", initialTimeout);
        await expect(controlValue).toHaveValue("Marko!");

        await controlValue.fill("updated from control");
        await expect(storyTextbox).toHaveValue("updated from control");

        await storyTextbox.fill("updated from input");
        await expect(controlValue).toHaveValue("updated from input");
      });

      test("Input types with a `Change` handler are controllable", async () => {
        const page = await getPage();
        const frame = page.frameLocator("#storybook-preview-iframe");
        await page.goto(`/?path=/story/${InitialValues.id}`);
        await page.getByText("Controls", { exact: true }).click(initialTimeout);
        const panel = page.locator("#storybook-panel-root");

        await expect(panel.getByText("pressed, pressedChange")).toBeVisible(
          initialTimeout,
        );

        await frame.getByRole("button", { name: "yellow" }).click();
        await expect(
          panel.getByRole("radio", { name: "yellow" }),
        ).toBeChecked();
      });
    });
  });

  test("a controllable component updates when Storybook won't re-render it", async () => {
    const canvasElement = document.body.appendChild(
      document.createElement("div"),
    );
    const storyContext = {
      id: "fixed",
      component: Controllable,
      canvasElement,
      args: { pressed: false },
      argTypes: { pressed: { controllable: true } },
    };
    renderToCanvas(
      {
        storyFn: () => ({ component: Controllable, input: { pressed: false } }),
        storyContext,
        showMain() {},
      } as any,
      canvasElement,
    );
    const button = Array.from(canvasElement.querySelectorAll("button")).find(
      (el) => el.textContent?.trim() === "OFF",
    )!;
    button.click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(button.textContent?.trim()).toBe("ON");
  });
});
