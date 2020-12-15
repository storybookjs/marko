import path from 'path';
import initStoryshots, { renderOnly } from '../dist/ts3.9';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: renderOnly,
});
