import path from 'path';
import fs from 'fs';

import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'react', {
    extraAddons: ['@storybook/preset-create-react-app'],
    // `@storybook/preset-create-react-app` has `@storybook/node-logger` as peerDep
    extraPackages: ['@storybook/node-logger'],
    staticDir: fs.existsSync(path.resolve('./public')) ? 'public' : undefined,
  });
};

export default generator;
