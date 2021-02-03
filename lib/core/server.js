/* eslint-disable global-require */
module.exports = {
  buildStatic: (...args) => {
    try {
      return require('@storybook/server-webpack5').buildStatic(...args);
    } catch (err) {
      return require('@storybook/server-webpack4').buildStatic(...args);
    }
  },
  buildDev: (...args) => {
    try {
      return require('@storybook/server-webpack5').buildDev(...args);
    } catch (err) {
      return require('@storybook/server-webpack4').buildStatic(...args);
    }
  },
};
