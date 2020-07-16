import fse from 'fs-extra';
import { SupportedFrameworks } from '../project_types';

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

function configurePreview(framework: SupportedFrameworks) {
  const parameters = `
export const parameters = {
  actions: { argTypesRegex: "^on.*" },
}`;

  const preview =
    framework === 'angular'
      ? `
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

${parameters}`
      : parameters;

  fse.writeFileSync('./.storybook/preview.js', preview, { encoding: 'utf8' });
}

export function configure(framework: SupportedFrameworks, addons: string[], custom?: any) {
  fse.ensureDirSync('./.storybook');
  configureMain(addons, custom);
  configurePreview(framework);
}
