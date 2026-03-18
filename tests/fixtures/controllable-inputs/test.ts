import { test } from "node:test";
import { render, screen } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";
import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default, InitialValues } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

test("controllable-inputs", async () => {
  await test(Default.storyName, async () => {
    await test("testing", async () => {
      await test("can render with no initial args", async () => {
        await render(Default);
        expect(screen.getByRole("button", { name: "OFF" })).toBeTruthy();
        const textbox = screen.getByRole("textbox") as HTMLInputElement;
        expect(textbox.value).toBe("");
        expect(Default.args).not.toHaveProperty("value");
        expect(Default.args).not.toHaveProperty("pressed");
        expect(Default.args).not.toHaveProperty("color");
      });
    });

    await testPage(async (page) => {
      const frame = page.frameLocator("#storybook-preview-iframe");

      await test("when value arg is unset, typing in input does not sync to args", async () => {
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

  await test(InitialValues.storyName, async () => {
    await testPage(async (page) => {
      const frame = page.frameLocator("#storybook-preview-iframe");

      await test("args and display stay in sync when arg is set", async () => {
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
    });
  });
});
