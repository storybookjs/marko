import { StoryFn, StoryContext } from '@storybook/addons';

// @ts-ignore
import toReact from 'svelte-adapter/react';

// @ts-ignore
import sveltedoc from 'sveltedoc-parser';
import React from 'react';

// @ts-ignore
import HOC from './HOC.svelte';

// Inspired by https://github.com/egoist/vue-to-react,
// modified to store args as props in the root store

// FIXME get this from @storybook/vue
const COMPONENT = 'STORYBOOK_COMPONENT';
const VALUES = 'STORYBOOK_VALUES';

export const prepareForInline = (storyFn: StoryFn, { args }: StoryContext) => {
  const component = toReact(storyFn());
  const el = React.useRef(null);

  React.useEffect(() => {
    const root = new HOC({
      target: el.current,
      props: {
        [COMPONENT]: component,
        [VALUES]: args,
      },
    });
    console.log(component);
    return () => root.$destroy();
  });
  return React.createElement('div', null, React.createElement('div', { ref: el }));
};
