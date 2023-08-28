// import fs from "fs";
// import path from "path";
// import * as playwright from "playwright";
// import storybook from "../standalone";

// declare global {
//   const page: playwright.Page;
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace NodeJS {
//     interface Global {
//       page: playwright.Page;
//     }
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-namespace
// declare namespace globalThis {
//   let page: playwright.Page;
// }

// declare function __report__(coverage: unknown): void;
// declare const __coverage__: unknown;

// const pendingCoverage: Promise<void>[] = [];
// let browser: playwright.Browser;

// export async function mochaGlobalSetup() {
//   [browser] = await Promise.all([
//     playwright.chromium.launch(),
//     storybook({
//       mode: "dev",
//       port: 8080,
//       ci: true,
//       quiet: true,
//       configDir: path.join(__dirname, ".storybook"),
//     }),
//   ]);

//   const context = await browser.newContext();

//   if (process.env.NYC_CONFIG) {
//     // Keep track of the test coverage from each page in the browser when it closes.
//     const NYC_CONFIG = JSON.parse(process.env.NYC_CONFIG) as {
//       tempDir: string;
//       cwd: string;
//     };
//     const coverageFilePrefix = path.join(
//       NYC_CONFIG.cwd,
//       NYC_CONFIG.tempDir,
//       process.env.NYC_PROCESS_ID!
//     );
//     await Promise.all([
//       context.exposeFunction("__report__", (coverage: unknown) => {
//         pendingCoverage.push(
//           fs.promises.writeFile(
//             `${coverageFilePrefix}-browser-${pendingCoverage.length}.json`,
//             JSON.stringify(coverage)
//           )
//         );
//       }),
//       context.addInitScript(() => {
//         window.addEventListener("beforeunload", () => {
//           if (__coverage__) {
//             __report__(__coverage__);
//           }
//         });
//       }),
//     ]);
//   }

//   globalThis.page = await context.newPage();
// }

// export async function mochaGlobalTeardown() {
//   await Promise.all(pendingCoverage.concat(browser.close()));
// }
