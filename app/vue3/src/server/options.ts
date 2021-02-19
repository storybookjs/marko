import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'vue3',
  frameworkPresets: [require.resolve('./framework-preset-vue3')],
};
