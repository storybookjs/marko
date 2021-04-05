/** @jsx h */
import { h } from 'preact';
import preactRenderer from 'preact-render-to-string/jsx';

const boundRenderer = (_storyElement: any, _rendererOptions: any) =>
  preactRenderer(_storyElement, null, { pretty: '  ' });

function getRenderedTree(story: any, context: any, { renderer, ...rendererOptions }: any) {
  const currentRenderer = renderer || boundRenderer;
  const tree = currentRenderer(h(story.render, null), rendererOptions);

  return tree;
}

export default getRenderedTree;
