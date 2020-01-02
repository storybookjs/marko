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
  parameters,
}: RenderMainArgs) {
  const params = storyFn();

  const {
    server: { url, id: storyId },
  } = parameters;

  if (fetchStoryHtml === undefined) {
    showError({
      title: `Expecting fetchStoryHtml to be configured for @storybook/server.`,
      description: dedent`
        Did you forget to pass a fetchStoryHtml function to configure?
        Use "configure(() => stories, module, { fetchStoryHtml: yourFetchHtmlFunction });".
      `,
    });
    return;
  }

  const fetchId = storyId || id;
  const element = await fetchStoryHtml(url, fetchId, params);

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
