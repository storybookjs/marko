import fs from 'fs-extra';
import path from 'path';
import { parse } from 'json5';

const logger = console;

const appsFolder = path.join(__dirname, '..', '..', '..', 'app');

const run = async () => {
  const apps = await fs.readdir(appsFolder);
  const versions = await Promise.all(
    apps.map(async (appName) => {
      const { name, version } = parse(
        await fs.readFile(path.join(appsFolder, appName, 'package.json'))
      );

      return {
        name,
        version,
      };
    })
  );

  await fs.writeFile(
    path.join(__dirname, '..', 'versions.json'),
    JSON.stringify(
      versions.reduce((acc, { name, version }) => ({ ...acc, [name]: version }), {}),
      null,
      2
    )
  );
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
