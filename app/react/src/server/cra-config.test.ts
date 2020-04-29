import fs from 'fs';
import { getReactScriptsPath } from './cra-config';

jest.mock('fs', () => ({
  realpathSync: jest.fn(() => '/test-project'),
  readFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
}));

const SCRIPT_PATH = '.bin/react-scripts';

describe('cra-config', () => {
  describe('when used with the default react-scripts package', () => {
    beforeEach(() => {
      ((fs.realpathSync as unknown) as jest.Mock).mockImplementationOnce((filePath) =>
        filePath.replace(SCRIPT_PATH, `react-scripts/${SCRIPT_PATH}`)
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/react-scripts'
      );
    });
  });

  describe('when used with a custom react-scripts package', () => {
    beforeEach(() => {
      ((fs.realpathSync as unknown) as jest.Mock).mockImplementationOnce((filePath) =>
        filePath.replace(SCRIPT_PATH, `custom-react-scripts/${SCRIPT_PATH}`)
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/custom-react-scripts'
      );
    });
  });

  describe('when used with a custom react-scripts package without symlinks in .bin folder', () => {
    beforeEach(() => {
      // In case of .bin/react-scripts is not symlink (like it happens on Windows),
      // realpathSync() method does not translate the path.
      ((fs.realpathSync as unknown) as jest.Mock).mockImplementationOnce((filePath) => filePath);

      ((fs.readFileSync as unknown) as jest.Mock).mockImplementationOnce(
        () => `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case \`uname\` in
    *CYGWIN*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../custom-react-scripts/bin/react-scripts.js" "$@"
  ret=$?
else
  node  "$basedir/../custom-react-scripts/bin/react-scripts.js" "$@"
  ret=$?
fi
exit $ret`
      );
    });

    it('should locate the react-scripts package', () => {
      expect(getReactScriptsPath({ noCache: true })).toEqual(
        '/test-project/node_modules/custom-react-scripts'
      );
    });
  });
});
