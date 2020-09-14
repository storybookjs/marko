export function webpackFinal(webpackConfig: any = {}, options: any = {}) {
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-docgen-loader', { paths: [require.resolve('@storybook/vue')] }),
    enforce: 'post',
    options: {
      docgenOptions: {
        alias: webpackConfig.resolve.alias,
        ...options.vueDocgenOptions,
      },
    },
  });
  return webpackConfig;
}
