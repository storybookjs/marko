import fs from 'fs';
import fse from 'fs-extra';

import * as helpers from './helpers';
import { StoryFormat } from './project_types';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  copySync: jest.fn(() => ({})),
}));

jest.mock('path', () => ({
  // make it return just the second path, for easier testing
  resolve: jest.fn((_, p) => p),
}));

describe('Helpers', () => {
  describe('copyTemplate', () => {
    it(`should fall back to ${StoryFormat.CSF} 
        in case ${StoryFormat.CSF_TYPESCRIPT} is not available`, () => {
      const csfDirectory = `template-${StoryFormat.CSF}/`;
      (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', StoryFormat.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should use ${StoryFormat.CSF_TYPESCRIPT} if it is available`, () => {
      const csfDirectory = `template-${StoryFormat.CSF_TYPESCRIPT}/`;
      (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', StoryFormat.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should throw an error for unsupported story format`, () => {
      const storyFormat = 'non-existent-format' as StoryFormat;
      const expectedMessage = `Unsupported story format: ${storyFormat}`;
      expect(() => {
        helpers.copyTemplate('', storyFormat);
      }).toThrowError(expectedMessage);
    });
  });
});
