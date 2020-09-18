import * as preact from 'preact';
import { document } from 'global';
import dedent from 'ts-dedent';
import { RenderContext, StoryFnPreactReturnType } from './types';

const rootElement = document ? document.getElementById('root') : null;

let renderedStory: Element;

function preactRender(element: StoryFnPreactReturnType | null): void {
  if ((preact as any).Fragment) {
    // Preact 10 only:
    preact.render(element, rootElement);
  } else if (element) {
    renderedStory = (preact.render(element, rootElement) as unknown) as Element;
  } else {
    preact.render(element, rootElement, renderedStory);
  }
}

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  forceRender,
}: RenderContext) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Preact element from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Preact element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  // But forceRender means that it's the same story, so we want to keep the state in that case.
  if (!forceRender) {
    preactRender(null);
  }

  showMain();

  preactRender(element);
}
