import { sortEntries } from './entries';

describe('sortEntries', () => {
  it('should do nothing', () => {
    const input = ['a', 'b', 'c', 'aa', 'cc', '123', '8000'];
    const output = sortEntries(input);

    expect(output).toEqual(['a', 'b', 'c', 'aa', 'cc', '123', '8000']);
  });
  it('should move preview-type generated-config entries after all other generated-config entries', () => {
    const input = [
      '/tmp/storybook/lib/core/dist/server/common/polyfills.js',
      '/tmp/storybook/lib/core/dist/server/preview/globals.js',
      '/tmp/storybook/examples/official-storybook/storybook-init-framework-entry.js',
      '/tmp/storybook/addons/docs/dist/frameworks/common/config.js-generated-config-entry.js',
      '/tmp/storybook/addons/docs/dist/frameworks/react/config.js-generated-config-entry.js',
      '/tmp/storybook/examples/official-storybook/preview.js-generated-config-entry.js',
      '/tmp/storybook/addons/actions/dist/preset/addArgs.js-generated-config-entry.js',
      '/tmp/storybook/addons/links/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/knobs/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/a11y/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/queryparams/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/examples/official-storybook/generated-stories-entry.js',
    ];
    const output = sortEntries(input);
    expect(output).toEqual([
      '/tmp/storybook/lib/core/dist/server/common/polyfills.js',
      '/tmp/storybook/lib/core/dist/server/preview/globals.js',
      '/tmp/storybook/examples/official-storybook/storybook-init-framework-entry.js',
      '/tmp/storybook/addons/actions/dist/preset/addArgs.js-generated-config-entry.js',
      '/tmp/storybook/addons/links/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/knobs/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/a11y/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/queryparams/dist/preset/addDecorator.js-generated-config-entry.js',
      '/tmp/storybook/addons/docs/dist/frameworks/common/config.js-generated-config-entry.js',
      '/tmp/storybook/addons/docs/dist/frameworks/react/config.js-generated-config-entry.js',
      '/tmp/storybook/examples/official-storybook/preview.js-generated-config-entry.js',
      '/tmp/storybook/examples/official-storybook/generated-stories-entry.js',
    ]);
  });
});
