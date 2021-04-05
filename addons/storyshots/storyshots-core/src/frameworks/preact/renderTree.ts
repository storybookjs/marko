/** @jsx h */

// eslint-disable-next-line import/no-extraneous-dependencies
import preactRenderer from 'preact-render-to-string/jsx';

const boundRenderer = (_storyElement: any, _rendererOptions: any) =>
  preactRenderer(_storyElement, null, { pretty: '  ' });

function getRenderedTree(story: any, context: any, { renderer, ...rendererOptions }: any) {
  const storyElement = story.render();
  const currentRenderer = renderer || boundRenderer;
  const tree = currentRenderer(storyElement, rendererOptions);

  return tree;
}

export default getRenderedTree;
