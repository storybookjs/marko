import { sync } from 'cross-spawn';
import dedent from 'ts-dedent';
import { Yarn2Proxy } from './Yarn2Proxy';

jest.mock('cross-spawn');
const syncMock = sync as jest.Mock;

describe('Yarn 2 Proxy', () => {
  const yarn2Proxy = new Yarn2Proxy();

  describe('initPackageJson', () => {
    it('should call spawn.sync and return console output', () => {
      const consoleOutput = dedent`{
                                      name: 'test'
                                    }`;

      syncMock.mockReturnValueOnce({ stdout: consoleOutput });

      const result = yarn2Proxy.initPackageJson();

      expect(syncMock).toHaveBeenCalledWith(
        'yarn',
        ['init'],
        expect.objectContaining({
          cwd: process.cwd(),
          env: process.env,
          stdio: 'pipe',
          encoding: 'utf-8',
        })
      );

      expect(result).toEqual(expect.any(String));
    });
  });
});
