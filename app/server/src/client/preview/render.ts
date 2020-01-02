import { document, Node } from 'global';
import dedent from 'ts-dedent';
import { RenderMainArgs, FetchStoryHtmlType } from './types';

const rootElement = document.getElementById('root');

let fetchStoryHtml: FetchStoryHtmlType;

export default async function renderMain({
  storyFn,
  id,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
}: RenderMainArgs) {
  const params = storyFn();

  const element = await fetchStoryHtml(id, params);

  showMain();
  if (typeof element === 'string') {
    rootElement.innerHTML = element;
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (rootElement.firstChild === element && forceRender === true) {
      return;
    }

    rootElement.innerHTML = '';
    rootElement.appendChild(element);
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}

export const setFetchStoryHtml: any = (fetchHtml: FetchStoryHtmlType) => {
  fetchStoryHtml = fetchHtml;
};
