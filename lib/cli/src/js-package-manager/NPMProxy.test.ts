import { sync } from 'cross-spawn';
import dedent from 'ts-dedent';
import { NPMProxy } from './NPMProxy';

jest.mock('cross-spawn');
const syncMock = sync as jest.Mock;

describe('NPM Proxy', () => {
  const npmProxy = new NPMProxy();

  describe('initPackageJson', () => {
    it('should call spawn.sync and return console output', () => {
      const consoleOutput = dedent`Wrote to /Users/johndoe/Documents/package.json:
                                  {
                                    "name": "toto",
                                    "version": "1.0.0",
                                    "description": "",
                                    "main": "index.js",
                                    "scripts": {
                                      "test": "echo \\"Error: no test specified\\" && exit 1"
                                    },
                                    "keywords": [],
                                    "author": "",
                                    "license": "ISC"
                                  }`;

      syncMock.mockReturnValueOnce({ stdout: consoleOutput });

      const result = npmProxy.initPackageJson();

      expect(syncMock).toHaveBeenCalledWith(
        'npm',
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
