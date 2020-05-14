import React from 'react';
import { Args, StoryContext } from '@storybook/addons';

export const argsStory = (initialArgs: Args) => {
  const example = (args: Args, { kind, parameters: { component: Component } }: StoryContext) => {
    if (!Component) {
      throw new Error(`No component parameter: ${kind}`);
    }
    return <Component {...args} />;
  };
  example.story = { args: initialArgs };
  return example;
};
