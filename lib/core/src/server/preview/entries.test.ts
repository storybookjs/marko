import { sortEntries } from './entries';

describe('sortEntries', () => {
  it('should do nothing', () => {
    const input = ['a', 'b', 'c', 'aa', 'cc', '123', '8000'];
    const output = sortEntries(input);

    expect(output).toEqual(['a', 'b', 'c', 'aa', 'cc', '123', '8000']);
  });
  it('should move preview-type generated-config entries after all other generated entries', () => {
    const input = [
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/common/polyfills.js',
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/preview/globals.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/web-components-kitchen-sink/.storybook/storybook-init-framework-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/web-components-kitchen-sink/.storybook/preview.js-generated-config-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/web-components/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
    ];
    const output = sortEntries(input);
    expect(output).toEqual([
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/common/polyfills.js',
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/preview/globals.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/web-components-kitchen-sink/.storybook/storybook-init-framework-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/web-components/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/web-components-kitchen-sink/.storybook/preview.js-generated-config-entry.js',
    ]);
  });
  it('should move stories-type after all other generated entries', () => {
    const input = [
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/common/polyfills.js',
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/preview/globals.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/storybook-init-framework-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/preview.js-generated-config-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/react/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/queryparams/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/generated-stories-entry.js',
    ];
    const output = sortEntries(input);
    expect(output).toEqual([
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/common/polyfills.js',
      '/Users/dev/Projects/GitHub/storybook/core/lib/core/dist/server/preview/globals.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/storybook-init-framework-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/docs/dist/frameworks/react/config.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/addons/queryparams/dist/preset/addDecorator.js-generated-other-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/preview.js-generated-config-entry.js',
      '/Users/dev/Projects/GitHub/storybook/core/examples/official-storybook/generated-stories-entry.js',
    ]);
  });
});
