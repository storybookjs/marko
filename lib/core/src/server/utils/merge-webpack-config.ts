function plugins<T>(
  { plugins: defaultPlugins = [] }: { plugins?: T[] },
  { plugins: customPlugins = [] }: { plugins?: T[] }
): T[] {
  return [...defaultPlugins, ...customPlugins];
}

function rules<T>(
  { rules: defaultRules = [] }: { rules?: T[] },
  { rules: customRules = [] }: { rules?: T[] }
): T[] {
  return [...defaultRules, ...customRules];
}

function extensions<T>(
  { extensions: defaultExtensions = [] }: { extensions?: T[] },
  { extensions: customExtensions = [] }: { extensions?: T[] }
): T[] {
  return [...defaultExtensions, ...customExtensions];
}

function alias(
  { alias: defaultAlias = {} }: { alias?: any },
  { alias: customAlias = {} }: { alias?: any }
) {
  return {
    ...defaultAlias,
    ...customAlias,
  };
}

function module(
  { module: defaultModule = {} }: { module?: any },
  { module: customModule = {} }: { module?: any }
) {
  return {
    ...defaultModule,
    ...customModule,
    rules: rules(defaultModule, customModule),
  };
}

function resolve(
  { resolve: defaultResolve = {} }: { resolve?: any },
  { resolve: customResolve = {} }: { resolve?: any }
) {
  return {
    ...defaultResolve,
    ...customResolve,
    alias: alias(defaultResolve, customResolve),
    extensions: extensions(defaultResolve, customResolve),
  };
}

function optimization(
  { optimization: defaultOptimization = {} }: { optimization?: any },
  { optimization: customOptimization = {} }: { optimization?: any }
) {
  return {
    ...defaultOptimization,
    ...customOptimization,
  };
}

function mergeConfigs(config: any, customConfig: any) {
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
