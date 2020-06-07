import {
  getVersions,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    babelPluginEmberModulePolyfillVersion,
    babelPluginHtmlBarsInlinePrecompileVersion,
    linksVersion,
    actionsVersion,
    addonsVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/ember',
    // babel-plugin-ember-modules-api-polyfill is a peerDep of @storybook/ember
    'babel-plugin-ember-modules-api-polyfill',
    // babel-plugin-htmlbars-inline-precompile is a peerDep of @storybook/ember
    'babel-plugin-htmlbars-inline-precompile',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addons'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = {
    ...packageJson.scripts,
    ...{
      storybook: 'start-storybook -p 6006 -s dist',
      'build-storybook': 'build-storybook -s dist',
    },
  };

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [
    `@storybook/ember@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `babel-plugin-ember-modules-api-polyfill@${babelPluginEmberModulePolyfillVersion}`,
    `babel-plugin-htmlbars-inline-precompile@${babelPluginHtmlBarsInlinePrecompileVersion}`,
    ...babelDependencies,
  ]);
};

export default generator;
