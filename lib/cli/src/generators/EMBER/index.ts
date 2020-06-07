import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    babelPluginEmberModulePolyfillVersion,
    babelPluginHtmlBarsInlinePrecompileVersion,
    linksVersion,
    actionsVersion,
    addonsVersion,
  ] = await packageManager.getVersions(
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

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/ember@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `babel-plugin-ember-modules-api-polyfill@${babelPluginEmberModulePolyfillVersion}`,
    `babel-plugin-htmlbars-inline-precompile@${babelPluginHtmlBarsInlinePrecompileVersion}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
