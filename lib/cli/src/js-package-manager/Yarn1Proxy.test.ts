import { sync } from 'cross-spawn';
import dedent from 'ts-dedent';
import { Yarn1Proxy } from './Yarn1Proxy';

jest.mock('cross-spawn');
const syncMock = sync as jest.Mock;

describe('Yarn Proxy', () => {
  const yarnProxy = new Yarn1Proxy();

  describe('initPackageJson', () => {
    it('should call spawn.sync and return console output', () => {
      const consoleOutput = dedent`
                              yarn init v1.22.4
                              warning The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.
                              success Saved package.json
                              ✨  Done in 0.02s.`;

      syncMock.mockReturnValueOnce({ stdout: consoleOutput });

      const result = yarnProxy.initPackageJson();

      expect(syncMock).toHaveBeenCalledWith(
        'yarn',
        ['init', '-y'],
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
