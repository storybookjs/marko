import fs from 'fs';
import path from 'path';
import injectDecorator from './inject-decorator';

describe('inject-decorator', () => {
  describe('positive - ts - csf', () => {
    it('includes storySource parameter in the default exported object', () => {
      const mockFilePath = './__mocks__/inject-decorator.ts.csf.txt';
      const source = fs.readFileSync(mockFilePath, 'utf-8');
      const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
        parser: 'typescript',
      });

      expect(result.source).toMatchSnapshot();
      expect(result.source).toEqual(
        expect.stringContaining(
          'export default {parameters: {"storySource":{"source":"import React from'
        )
      );
    });
  });

  describe('injectStoryParameters - ts - csf', () => {
    it('includes storySource parameter in the default exported object', () => {
      const mockFilePath = './__mocks__/inject-parameters.ts.csf.txt';
      const source = fs.readFileSync(mockFilePath, 'utf-8');
      const result = injectDecorator(source, path.resolve(__dirname, mockFilePath), {
        injectStoryParameters: true,
        parser: 'typescript',
      });

      expect(result.source).toMatchSnapshot();
    });
  });
});
