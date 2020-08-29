import autoPreprocess from 'svelte-preprocess';

export function webpackFinal(webpackConfig: any = {}, options: any = {}) {
  const svelteLoader = webpackConfig.module.rules.find(
    (r: { loader: string | string[] }) => r.loader && r.loader.includes('ass')
  );
  svelteLoader.options.preprocess = autoPreprocess();
  webpackConfig.resolve.extensions.push('.ts', '.tsx');
  return webpackConfig;
}
