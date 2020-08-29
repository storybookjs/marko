import { StoryFn, StoryContext } from '@storybook/addons';

// @ts-ignore
import toReact from 'svelte-adapter/react';

// Inspired by https://github.com/egoist/vue-to-react,
// modified to store args as props in the root store

// FIXME get this from @storybook/vue
const COMPONENT = 'STORYBOOK_COMPONENT';
const VALUES = 'STORYBOOK_VALUES';

export const prepareForInline = (storyFn: StoryFn, { args }: StoryContext) => {
  return toReact(storyFn());
};
