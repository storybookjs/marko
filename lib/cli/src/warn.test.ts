import globby from 'globby';
import { logger } from '@storybook/node-logger';
import { warn } from './warn';

jest.mock('@storybook/node-logger');
jest.mock('globby');

describe('warn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when TypeScript is installed as a dependency', () => {
    it('should not warn', () => {
      warn({
        hasTSDependency: true,
      });
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });

  describe('when TypeScript is not installed as a dependency', () => {
    it('should not warn if `.tsx?` files are not found', () => {
      (globby.sync as jest.Mock).mockReturnValueOnce([]);
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(0);
    });

    it('should warn if `.tsx?` files are found', () => {
      (globby.sync as jest.Mock).mockReturnValueOnce(['a.ts']);
      warn({
        hasTSDependency: false,
      });
      expect(logger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
