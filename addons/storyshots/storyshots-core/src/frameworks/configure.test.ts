import { getPreviewFile, getMainFile } from './configure';

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs', () => require('../../../../../__mocks__/fs'));
const setupFiles = (files: Record<string, string>) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('preview files', () => {
  it.each`
    filepath
    ${'preview.ts'}
    ${'preview.tsx'}
    ${'preview.js'}
    ${'preview.jsx'}
    ${'config.ts'}
    ${'config.tsx'}
    ${'config.js'}
    ${'config.jsx'}
  `('resolves a valid preview file from $filepath', ({ filepath }) => {
    setupFiles({ [`test/${filepath}`]: 'true' });

    expect(getPreviewFile('test/')).toEqual(`test/${filepath}`);
  });

  it('returns false when none of the paths exist', () => {
    setupFiles(Object.create(null));

    expect(getPreviewFile('test/')).toEqual(false);
  });
});

describe('main files', () => {
  it.each`
    filepath
    ${'main.ts'}
    ${'main.tsx'}
    ${'main.js'}
    ${'main.jsx'}
  `('resolves a valid main file path from $filepath', ({ filepath }) => {
    setupFiles({ [`test/${filepath}`]: 'true' });

    expect(getMainFile('test/')).toEqual(`test/${filepath}`);
  });

  it('returns false when none of the paths exist', () => {
    setupFiles(Object.create(null));

    expect(getPreviewFile('test/')).toEqual(false);
  });
});
