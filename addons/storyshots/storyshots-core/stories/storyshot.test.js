import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '../dist/ts3.9';

jest.mock('@storybook/node-logger');

// with react-test-renderer
initStoryshots({
  framework: 'react',
  // Ignore integrityOptions for async.storyshot because only run when asyncJest is true
  integrityOptions: { cwd: __dirname, ignore: ['**/**.async.storyshot'] },
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions(),
});
