import fse from 'fs-extra';

function mainConfigurationGenerator(addons: string[], custom?: any) {
  const hasSrc = fse.existsSync('./src');

  const config = {
    stories: [!hasSrc && '../stories/**/*.stories.*', hasSrc && '../src/**/*.stories.*'].filter(
      Boolean
    ),
    addons,
    ...custom,
  };

  const stringified = `module.exports = ${JSON.stringify(config, null, 2)}`;
  fse.ensureDirSync('./.storybook');
  fse.writeFileSync('./.storybook/main.js', stringified, { encoding: 'utf8' });
}

export default mainConfigurationGenerator;
