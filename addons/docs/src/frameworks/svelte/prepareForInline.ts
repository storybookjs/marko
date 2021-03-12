import { StoryContext, StoryFn } from '@storybook/addons';

import React from 'react';

// @ts-ignore
import HOC from './HOC.svelte';

export const prepareForInline = (storyFn: StoryFn, context: StoryContext) => {
  const el = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    const { applyLoaders, unboundStoryFn } = context;

    let cpn: any;

    applyLoaders().then((storyContext: StoryContext) => {
      if (!cancelled) {
        cpn = new HOC({
          target: el.current,
          props: {
            storyContext,
            unboundStoryFn,
          },
        });
      }
    });

    return () => {
      cancelled = true;
      if (cpn) {
        cpn.$destroy();
      }
    };
  });

  return React.createElement('div', { ref: el });
};
