import * as assert from "assert";
import { composeStories } from "../../testing";
import * as stories from "./stories";

const id = "invalidstory--default";

describe(stories.default.title, () => {
  describe("iframe", () => {
    before(async () => {
      await page.goto(`http://localhost:8080/iframe.html?id=${id}`);
    });

    it("shows error text", async () => {
      assert.ok(await page.waitForSelector(`text=Did you forget`));
    });
  });

  describe("testing", () => {
    it("can render the composed stories", async () => {
      assert.throws(() => composeStories(stories));
    });
  });
});
