import path from 'path';
import fs from 'fs-extra';

import { testMetadata } from 'teamcity-service-messages';
import { findSuitesAndTests } from 'mocha-list-tests';

const testsDir = path.join(__dirname, 'integration');
const videosDir = path.join(__dirname, 'videos');
const screensDir = path.join(__dirname, 'screenshots');

const getTests = (fileName: string) => findSuitesAndTests(path.join(testsDir, fileName)).tests

async function reportVideos() {
  const files = await fs.readdir(videosDir);
  files.forEach(file =>
    getTests(file.replace(/\.mp4$/, '')).forEach((test: string) =>
      testMetadata({
        testName: test.replace(/\./, ': '),
        type: 'video',
        value: `videos.tar.gz!${file}`,
      })
    )
  );
}

async function reportScreenshots() {
  const dirs = await fs.readdir(screensDir);
  dirs.forEach(async dir => {
    const currentDir = path.join(screensDir, dir);
    const files = await fs.readdir(currentDir);
    files.forEach(file => {
      const match = file.match(/^(.*) \(failed\).png$/);
      if (match == null) {
        return;
      }
      testMetadata({
        testName: match[1]
          .split(' -- ')
          .slice(0, 2)
          .join(': '),
        type: 'image',
        value: `screenshots.tar.gz!${currentDir}/${file}`,
      });
    });
  });
}

reportVideos();
reportScreenshots();
