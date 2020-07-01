import fse from 'fs-extra';

function configureMain(addons: string[], custom?: any) {
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

function configurePreview() {
  fse.writeFileSync(
    './.storybook/preview.js',
    `export const parameters = {
  actions: { argTypesRegex: "^on.*" },
}`,
    { encoding: 'utf8' }
  );
}

export function configure(addons: string[], custom?: any) {
  fse.ensureDirSync('./.storybook');
  configureMain(addons, custom);
  configurePreview();
}
