import { precompile } from 'ember-source/dist/ember-template-compiler';
import { Configuration } from 'webpack'; // eslint-disable-line

let emberOptions: any;

function precompileWithPlugins(string: string, options: any) {
  const precompileOptions: any = options;
  if (emberOptions && emberOptions.polyfills) {
    precompileOptions.plugins = { ast: emberOptions.polyfills };
  }

  return precompile(string, precompileOptions);
}

export function babel(config: Configuration, options: any) {
  if (options && options.presetsList) {
    options.presetsList.forEach((e: any, index: number) => {
      if (e.preset && e.preset.emberOptions) {
        emberOptions = e.preset.emberOptions;
        // eslint-disable-next-line no-param-reassign
        delete options.presetsList[index].preset.emberOptions;
      }
    });
  }

  const babelConfigPlugins = config.plugins || [];

  const extraPlugins = [
    [
      require.resolve('babel-plugin-htmlbars-inline-precompile'),
      {
        precompile: precompileWithPlugins,
        modules: {
          'ember-cli-htmlbars': 'hbs',
          'ember-cli-htmlbars-inline-precompile': 'default',
          'htmlbars-inline-precompile': 'default',
        },
      },
    ],
    [require.resolve('babel-plugin-ember-modules-api-polyfill')],
  ];

  return {
    ...config,
    plugins: [].concat(babelConfigPlugins, extraPlugins),
  };
}
