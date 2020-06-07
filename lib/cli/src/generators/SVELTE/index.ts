import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    svelte,
    svelteLoader,
  ] = await packageManager.getVersions(
    npmOptions,
    '@storybook/svelte',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'svelte',
    'svelte-loader'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/svelte@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `svelte@${svelte}`,
    `svelte-loader@${svelteLoader}`,
    ...babelDependencies,
  ]);
};

export default generator;
