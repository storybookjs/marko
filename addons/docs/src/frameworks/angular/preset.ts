import { Configuration, IgnorePlugin, Plugin } from 'webpack';

export function webpackFinal(webpackConfig: Configuration = {}): Configuration {
  return {
    ...webpackConfig,
    plugins: [...webpackConfig.plugins, ...makeAngularElementRendererOptional()],
  };
}
/**
 * Ignore `@storybook/angular/element-renderer` import if `@angular/elements` is not available
 */
function makeAngularElementRendererOptional(): Plugin[] {
  if (
    moduleIsAvailable('@angular/elements') &&
    moduleIsAvailable('@webcomponents/custom-elements')
  ) {
    return [];
  }
  return [new IgnorePlugin(/@storybook(\\|\/)angular(\\|\/)element-renderer/)];
}

function moduleIsAvailable(moduleName: string): boolean {
  try {
    require.resolve(moduleName);
    return true;
  } catch (e) {
    return false;
  }
}
