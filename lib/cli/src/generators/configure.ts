import fse from 'fs-extra';
import { SupportedFrameworks } from '../project_types';

interface ConfigureMainOptions {
  addons: string[];
  extensions?: string[];
  commonJs?: boolean;
  /**
   * Extra values for main.js
   *
   * In order to provide non-serializable data like functions, you can use
   * { value: '%%yourFunctionCall()%%' }
   *
   * '%% and %%' will be replace.
   *
   */
  [key: string]: any;
}

function configureMain({
  addons,
  extensions = ['js', 'jsx', 'ts', 'tsx'],
  commonJs = false,
  ...custom
}: ConfigureMainOptions) {
  const prefix = fse.existsSync('./src') ? '../src' : '../stories';

  const config = {
    stories: [`${prefix}/**/*.stories.mdx`, `${prefix}/**/*.stories.@(${extensions.join('|')})`],
    addons,
    ...custom,
  };

  // replace escaped values and delimiters
  const stringified = `module.exports = ${JSON.stringify(config, null, 2)
    .replace(/\\"/g, '"')
    .replace(/['"]%%/g, '')
    .replace(/%%['"]/, '')}`;
  fse.ensureDirSync('./.storybook');
  fse.writeFileSync(`./.storybook/main.${commonJs ? 'cjs' : 'js'}`, stringified, {
    encoding: 'utf8',
  });
}

function configurePreview(framework: SupportedFrameworks, commonJs: boolean) {
  const parameters = `
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}`;

  const preview =
    framework === 'angular'
      ? `
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

${parameters}`
      : parameters;

  fse.writeFileSync(`./.storybook/preview.${commonJs ? 'cjs' : 'js'}`, preview, {
    encoding: 'utf8',
  });
}

export function configure(framework: SupportedFrameworks, mainOptions: ConfigureMainOptions) {
  fse.ensureDirSync('./.storybook');

  configureMain(mainOptions);
  configurePreview(framework, mainOptions.commonJs);
}
