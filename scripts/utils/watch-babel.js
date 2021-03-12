const path = require('path');
const { babelify } = require('./compile-babel');

const modulePath = path.resolve('./');

babelify({
  modules: true,
  silent: false,
  watch: true,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile js'),
});
