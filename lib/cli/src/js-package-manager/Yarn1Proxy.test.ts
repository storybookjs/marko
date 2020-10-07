import { Yarn1Proxy } from './Yarn1Proxy';

describe('Yarn 1 Proxy', () => {
  let yarn1Proxy: Yarn1Proxy;

  beforeEach(() => {
    yarn1Proxy = new Yarn1Proxy();
  });

  it('type should be yarn1', () => {
    expect(yarn1Proxy.type).toEqual('yarn1');
  });

  describe('initPackageJson', () => {
    it('should run `yarn init -y`', () => {
      const executeCommandSpy = jest.spyOn(yarn1Proxy, 'executeCommand').mockReturnValue('');

      yarn1Proxy.initPackageJson();

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', ['init', '-y']);
    });
  });

  describe('installDependencies', () => {
    it('should run `yarn`', () => {
      const executeCommandSpy = jest.spyOn(yarn1Proxy, 'executeCommand').mockReturnValue('');

      yarn1Proxy.installDependencies();

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', [], expect.any(String));
    });
  });

  describe('addDependencies', () => {
    it('with devDep it should run `yarn install -D --ignore-workspace-root-check @storybook/addons`', () => {
      const executeCommandSpy = jest.spyOn(yarn1Proxy, 'executeCommand').mockReturnValue('');

      yarn1Proxy.addDependencies({ installAsDevDependencies: true }, ['@storybook/addons']);

      expect(executeCommandSpy).toHaveBeenCalledWith(
        'yarn',
        ['add', '-D', '--ignore-workspace-root-check', '@storybook/addons'],
        expect.any(String)
      );
    });
  });

  describe('latestVersion', () => {
    it('without constraint it returns the latest version', async () => {
      const executeCommandSpy = jest
        .spyOn(yarn1Proxy, 'executeCommand')
        .mockReturnValue('{"type":"inspect","data":"5.3.19"}');

      const version = await yarn1Proxy.latestVersion('@storybook/addons');

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', [
        'info',
        '@storybook/addons',
        'version',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('with constraint it returns the latest version satisfying the constraint', async () => {
      const executeCommandSpy = jest
        .spyOn(yarn1Proxy, 'executeCommand')
        .mockReturnValue('{"type":"inspect","data":["4.25.3","5.3.19","6.0.0-beta.23"]}');

      const version = await yarn1Proxy.latestVersion('@storybook/addons', '5.X');

      expect(executeCommandSpy).toHaveBeenCalledWith('yarn', [
        'info',
        '@storybook/addons',
        'versions',
        '--json',
      ]);
      expect(version).toEqual('5.3.19');
    });

    it('throws an error if command output is not a valid JSON', async () => {
      jest.spyOn(yarn1Proxy, 'executeCommand').mockReturnValue('NOT A JSON');

      await expect(yarn1Proxy.latestVersion('@storybook/addons')).rejects.toThrow();
    });
  });
});
