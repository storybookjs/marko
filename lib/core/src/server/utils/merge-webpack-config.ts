import { Configuration, Module, Resolve } from 'webpack';

function plugins(
  { plugins: defaultPlugins = [] }: Configuration,
  { plugins: customPlugins = [] }: Configuration
): Configuration['plugins'] {
  return [...defaultPlugins, ...customPlugins];
}

function rules(
  { rules: defaultRules = [] }: Module,
  { rules: customRules = [] }: Module
): Module['rules'] {
  return [...defaultRules, ...customRules];
}

function extensions(
  { extensions: defaultExtensions = [] }: Resolve,
  { extensions: customExtensions = [] }: Resolve
): Resolve['extensions'] {
  return [...defaultExtensions, ...customExtensions];
}

function alias(
  { alias: defaultAlias = {} }: Resolve,
  { alias: customAlias = {} }: Resolve
): Resolve['alias'] {
  return {
    ...defaultAlias,
    ...customAlias,
  };
}

function module(
  { module: defaultModule = { rules: [] } }: Configuration,
  { module: customModule = { rules: [] } }: Configuration
): Configuration['module'] {
  return {
    ...defaultModule,
    ...customModule,
    rules: rules(defaultModule, customModule),
  };
}

function resolve(
  { resolve: defaultResolve = {} }: Configuration,
  { resolve: customResolve = {} }: Configuration
): Configuration['resolve'] {
  return {
    ...defaultResolve,
    ...customResolve,
    alias: alias(defaultResolve, customResolve),
    extensions: extensions(defaultResolve, customResolve),
  };
}

function optimization(
  { optimization: defaultOptimization = {} }: Configuration,
  { optimization: customOptimization = {} }: Configuration
): Configuration['optimization'] {
  return {
    ...defaultOptimization,
    ...customOptimization,
  };
}

export function mergeConfigs(config: Configuration, customConfig: Configuration): Configuration {
  return {
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...customConfig,
    ...config,
    devtool: customConfig.devtool || config.devtool,
    plugins: plugins(config, customConfig),
    module: module(config, customConfig),
    resolve: resolve(config, customConfig),
    optimization: optimization(config, customConfig),
  };
}

export default mergeConfigs;
