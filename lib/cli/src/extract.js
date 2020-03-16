import puppeteer from 'puppeteer';
import { writeFile } from 'fs-extra';
import express from 'express';

const read = async url => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForFunction(
    'window.__STORYBOOK_STORY_STORE__ && window.__STORYBOOK_STORY_STORE__.extract && window.__STORYBOOK_STORY_STORE__.extract()'
  );
  const data = JSON.parse(
    await page.evaluate(async () => {
      const d = window.__STORYBOOK_STORY_STORE__.extract();

      const result = Object.entries(d).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: {
            ...v,
            parameters: {
              globalArgs: v.parameters.globalArgs,
              globalArgTypes: v.parameters.globalArgTypes,
              options: v.parameters.options,
              args: v.parameters.args,
              argTypes: v.parameters.argTypes,
              framework: v.parameters.framework,
              fileName: v.parameters.fileName,
            },
          },
        }),
        {}
      );
      return JSON.stringify(result, null, 2);
    })
  );

  setImmediate(() => {
    browser.close();
  });
  return data;
};

const useLocation = async path => {
  if (path.match(/^http/)) {
    return [path, async () => {}];
  }

  const app = express();

  app.use(express.static(path));

  return new Promise((resolve, reject) => {
    const server = app.listen(0, e => {
      if (e) {
        reject(e);
      }

      const address = server.address();

      resolve([
        typeof address === 'string'
          ? address
          : `http://[${address.address}]:${address.port}/iframe.html`,
        server.close.bind(server),
      ]);
    });
  });
  //
};

export async function extract(input, targetPath) {
  if (input && targetPath) {
    const [location, exit] = await useLocation(input);

    const stories = await read(location);

    await writeFile(targetPath, JSON.stringify({ stories }, null, 2));

    await exit();
  } else {
    throw new Error(
      'Extract: please specify a path where your built-storybook is (can be a public url) and a target directory'
    );
  }
}
