import { filterPresetsConfig } from './config';

describe('filterPresetsConfig', () => {
  it('string config', () => {
    expect(
      filterPresetsConfig(['@storybook/preset-scss', '@storybook/preset-typescript'])
    ).toEqual(['@storybook/preset-scss']);
  });

  it('object config', () => {
    const tsConfig = {
      name: '@storybook/preset-typescript',
      options: { foo: 1 },
    };
    expect(filterPresetsConfig([tsConfig, 'a'])).toEqual(['a']);
  });
});
