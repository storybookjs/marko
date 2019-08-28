import { DebugConfiguration } from '@aurelia/debug';
import { BasicConfiguration } from '@aurelia/jit-html-browser';
import { Aurelia } from '@aurelia/runtime';
import { RenderMainArgs } from './types';
export default function render({ storyFn, selectedKind, selectedStory, showMain, showError }: RenderMainArgs) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting an Aurelia component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: `
        Did you forget to return the Aurelia component from the story?
        Use "() => ({ template: '<custom-component></custom-component>' })" when defining the story.
      `,
    });
  }
  const host = document.getElementById('root');
  showMain();
  new Aurelia()
    .register(BasicConfiguration, DebugConfiguration)
    .app({
      host: host,
      component: element
    })
    .start();
}