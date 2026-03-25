import { render } from "@marko/testing-library";
import { composeStories } from "@storybook/marko";
import { expect } from "playwright/test";

import { testPage } from "../../test-page";
import * as stories from "./stories";

const { Default } = composeStories(stories);
const initialTimeout = { timeout: 60000 };

describe("invalid", () => {
  describe(Default.storyName, () => {
    describe("testing", () => {
      test("errors when rendering", async () => {
        await expect(render(Default)).rejects.toThrow(
          /Expected a component to be specified in the story/,
        );
      });
    });

    testPage((getPage) => {
      test(`shows error display`, async () => {
        const page = await getPage();
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
