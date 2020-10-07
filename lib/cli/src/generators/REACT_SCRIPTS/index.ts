import path from 'path';
import fs from 'fs';

import { baseGenerator, Generator } from '../baseGenerator';
import { copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'react', {
    extraAddons: ['@storybook/preset-create-react-app'],
    // `@storybook/preset-create-react-app` has `@storybook/node-logger` as peerDep
    extraPackages: ['@storybook/node-logger'],
    staticDir: fs.existsSync(path.resolve('./public')) ? 'public' : undefined,
  });
  if (options.storyFormat === StoryFormat.MDX) {
    copyTemplate(__dirname, StoryFormat.MDX);
  }
};

export default generator;
