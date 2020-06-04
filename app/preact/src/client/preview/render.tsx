import { h, render } from 'preact';
import { document } from 'global';
import dedent from 'ts-dedent';
import { RenderContext } from './types';

const rootElement = document ? document.getElementById('root') : null;

export default function renderMain({ storyFn, kind, name, showMain, showError }: RenderContext) {
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

  render(null, rootElement);

  showMain();

  render(element, rootElement);
}
