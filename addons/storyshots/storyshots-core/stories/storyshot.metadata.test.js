import path from 'path';
import initStoryshots from '../dist/ts3.9';

// jest.mock('@storybook/node-logger');

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, 'exported_metadata'),
});
