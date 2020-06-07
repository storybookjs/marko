import fs from 'fs';
import JSON5 from 'json5';
import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    knobsVersion,
    addonsVersion,
    reactVersion,
    reactDomVersion,
    presetEnvVersion,
    presetReactVersion,
  ] = await packageManager.getVersions(
    '@storybook/react',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addons',
    'react',
    'react-dom',
    '@babel/preset-env',
    '@babel/preset-react'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.scripts = packageJson.scripts || {};
  packageJson.dependencies = packageJson.dependencies || {};

  const devDependencies = [
    `@storybook/react@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addon-knobs@${knobsVersion}`,
    `@storybook/addons@${addonsVersion}`,
  ];

  // create or update .babelrc
  let babelrc = null;
  if (fs.existsSync('.babelrc')) {
    const babelrcContent = fs.readFileSync('.babelrc', 'utf8');
    babelrc = JSON5.parse(babelrcContent);
    babelrc.plugins = babelrc.plugins || [];
  } else {
    babelrc = {
      presets: [
        ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
        '@babel/preset-react',
      ],
    };

    devDependencies.push(`@babel/preset-env@${presetEnvVersion}`);
    devDependencies.push(`@babel/preset-react@${presetReactVersion}`);
  }

  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  // add react packages.
  const dependencies = [];
  if (!packageJson.dependencies.react) {
    dependencies.push(`react@${reactVersion}`);
  }
  if (!packageJson.dependencies['react-dom']) {
    dependencies.push(`react-dom@${reactDomVersion}`);
  }

  if (dependencies.length > 0) {
    packageManager.addDependencies(
      { ...npmOptions, packageJson, installAsDevDependencies: false },
      dependencies
    );
  }

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...devDependencies,
    ...babelDependencies,
  ]);
};

export default generator;
