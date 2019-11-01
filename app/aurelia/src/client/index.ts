export * from './preview';

// tsc wants to use NodeModule instead of WebpackModule
declare const module: any;
if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
