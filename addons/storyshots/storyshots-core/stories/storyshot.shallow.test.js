import path from 'path';
import initStoryshots, { shallowSnapshot } from '../dist/ts3.9';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: shallowSnapshot,
});
