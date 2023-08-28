// import * as assert from "assert";
// import type * as playwright from "playwright";
// import { render, screen } from "@marko/testing-library";
// import * as stories from "./stories";
// import { composeStories } from "../../testing";

// const id = "splitcomponent--hello-world";

// describe(stories.default.title!, () => {
//   describe("iframe", () => {
//     before(async () => {
//       await page.goto(`http://localhost:8080/iframe.html?id=${id}`);
//     });

//     it("shows correct name", async () => {
//       const $el = await page.waitForSelector("text=Hello");
//       assert.strictEqual(await $el.innerText(), "Hello World");
//     });
//   });

//   describe("addons", () => {
//     let frame: playwright.Frame;

//     before(async () => {
//       await page.goto(`http://localhost:8080/?path=/story/${id}`);
//       frame = (await (
//         await page.waitForSelector("#storybook-preview-iframe")
//       ).contentFrame())!;
//       await frame.waitForLoadState();
//     });

//     it("supports controls addon", async () => {
//       await page.waitForTimeout(100);
//       await page.click("text=Controls");
//       await page.fill('textarea:has-text("World")', "Updated");
//       assert.ok(await frame.waitForSelector('div:has-text("Hello Updated")'));
//     });

//     it("can navigate to another story", async () => {
//       await Promise.all([
//         frame.waitForNavigation(),
//         page.click('a:has-text("Hello Marko")'),
//       ]);

//       assert.ok(await frame.waitForSelector('div:has-text("Hello Marko")'));
//     });
//   });

//   describe("testing", () => {
//     const { HelloWorld, HelloMarko } = composeStories(stories);

//     it("can render the hello world story", async () => {
//       await render(HelloWorld);
//       assert.ok(screen.getByText("Hello World"));
//       assert.strictEqual(HelloWorld.args.name, "World");
//     });

//     it("can render the hello marko story", async () => {
//       await render(HelloMarko);
//       assert.ok(screen.getByText("Hello Marko"));
//       assert.strictEqual(HelloMarko.args.name, "Marko");
//     });
//   });
// });
