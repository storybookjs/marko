import { StoryFn, StoryContext } from '@storybook/addons';

import React from 'react';

// @ts-ignore
import HOC from './HOC.svelte';

export const prepareForInline = (storyFn: StoryFn, context: StoryContext) => {
  // @ts-ignore
  const story: { Component: any; props: any } = storyFn();
  const el = React.useRef(null);
  React.useEffect(() => {
    const root = new HOC({
      target: el.current,
      props: {
        component: story.Component,
        context,
        props: story.props,
        slot: story.Component,
      },
    });
    return () => root.$destroy();
  });

  return React.createElement('div', { ref: el });
};
