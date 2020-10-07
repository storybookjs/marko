import { NPMProxy } from './NPMProxy';

describe('NPM Proxy', () => {
  let npmProxy: NPMProxy;

  beforeEach(() => {
    npmProxy = new NPMProxy();
  });

  it('type should be npm', () => {
    expect(npmProxy.type).toEqual('npm');
  });

  describe('initPackageJson', () => {
    it('should run `npm init -y`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.initPackageJson();

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', ['init', '-y']);
    });
  });

  describe('installDependencies', () => {
    it('should run `npm install`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.installDependencies();

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', ['install'], expect.any(String));
    });
  });

  describe('addDependencies', () => {
    it('with devDep it should run `npm install -D @storybook/addons`', () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('');

      npmProxy.addDependencies({ installAsDevDependencies: true }, ['@storybook/addons']);

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'npm',
        ['install', '-D', '@storybook/addons'],
        expect.any(String)
      );
    });
  });

  describe('latestVersion', () => {
    it('without constraint it returns the latest version', async () => {
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('"5.3.19"');

      const version = await npmProxy.latestVersion('@storybook/addons');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/addons',
        'version',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('with constraint it returns the latest version satisfying the constraint', async () => {
      const executeCommandSpy = jest
        .spyOn(npmProxy, 'executeCommand')
        .mockReturnValue('["4.25.3","5.3.19","6.0.0-beta.23"]');

      const version = await npmProxy.latestVersion('@storybook/addons', '5.X');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/addons',
        'versions',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('throws an error if command output is not a valid JSON', async () => {
      jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('NOT A JSON');

      await expect(npmProxy.latestVersion('@storybook/addons')).rejects.toThrow();
    });
  });

  describe('getVersion', () => {
    it('with a Storybook package listed in versions.json it returns the version', async () => {
      // eslint-disable-next-line global-require
      const storybookAngularVersion = require('../../versions.json')['@storybook/angular'];
      const executeCommandSpy = jest.spyOn(npmProxy, 'executeCommand').mockReturnValue('"5.3.19"');

      const version = await npmProxy.getVersion('@storybook/angular');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/angular',
        'version',
        '--json',
      ]);
      expect(version).toEqual(`^${storybookAngularVersion}`);
    });

    it('with a Storybook package not listed in versions.json it returns the latest version', async () => {
      const packageVersion = '5.3.19';
      const executeCommandSpy = jest
        .spyOn(npmProxy, 'executeCommand')
        .mockReturnValue(`"${packageVersion}"`);

      const version = await npmProxy.getVersion('@storybook/react-native');

      expect(executeCommandSpy).toHaveBeenCalledWith('npm', [
        'info',
        '@storybook/react-native',
        'version',
        '--json',
      ]);
      expect(version).toEqual(`^${packageVersion}`);
    });
  });
});
