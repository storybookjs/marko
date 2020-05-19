import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type LoaderOptions from 'react-docgen-typescript-loader/dist/LoaderOptions';

/**
 * The interface for Storybook configuration in `main.js` files.
 */
export interface StorybookConfig {
  /**
   * Sets the addons you want to use with Storybook.
   *
   * @example `['@storybook/addon-essentials']`
   */
  addons: string[];
  /**
   * Tells Storybook where to find stories.
   *
   * @example `['./src/*.stories.(j|t)sx?']`
   */
  stories: string[];
  /**
   * Controls how Storybook hanldes TypeScript files.
   */
  typescript?: Partial<TypescriptOptions>;
}

/**
 * The internal options object, used by Storybook frameworks and adddons.
 */
export interface StorybookOptions {
  typescriptOptions: TypescriptOptions;
}

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions {
  /**
   * Enables type checking within Storybook.
   *
   * @defalt `false`
   */
  check: boolean;
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions?: ForkTsCheckerWebpackPlugin['options'];
  /**
   * Sets the type of Docgen when working with React and TypeScript
   *
   * @default `'react-docgen-typescript'`
   */
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
  /**
   * Configures `react-docgen-typescript-loader`
   */
  reactDocgenTypescriptOptions?: LoaderOptions;
}
