// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import reactTestRenderer from 'react-test-renderer';

function getRenderedTree(story: any, context: any, { renderer, ...rendererOptions }: any) {
  const StoryFn = story.render;
  const storyElement = React.createElement(StoryFn);
  const currentRenderer = renderer || reactTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);

  return tree;
}

export default getRenderedTree;
