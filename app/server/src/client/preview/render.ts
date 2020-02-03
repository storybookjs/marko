import { document, fetch, Node } from 'global';
import dedent from 'ts-dedent';
import { RenderMainArgs, FetchStoryHtmlType } from './types';

const rootElement = document.getElementById('root');

let fetchStoryHtml: FetchStoryHtmlType = async (url, path, params) => {
  const fetchUrl = new URL(`${url}/${path}`);
  fetchUrl.search = new URLSearchParams(params).toString();

  const response = await fetch(fetchUrl);
  return response.text();
};

export async function renderMain({
  storyFn,
  id,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
  parameters,
}: RenderMainArgs) {
  const storyParams = storyFn();

  const {
    server: { url, id: storyId, params },
  } = parameters;

  const fetchId = storyId || id;
  const fetchParams = { ...params, ...storyParams };
  const element = await fetchStoryHtml(url, fetchId, fetchParams);

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
  if (fetchHtml !== undefined) {
    fetchStoryHtml = fetchHtml;
  }
};
