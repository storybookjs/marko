import { document } from 'global';
import { DebugConfiguration } from '@aurelia/debug';
import { JitHtmlBrowserConfiguration } from '@aurelia/jit-html-browser';
import { Aurelia, INode, CustomElement, CustomElementType, IViewModel } from '@aurelia/runtime';
import { Registration, Constructable } from '@aurelia/kernel';
import { RenderMainArgs } from './types';
import { Component } from './decorators';
import { generateKnobsFor } from '.';

const host = document.getElementById('root'); // the root iframe provided by storybook
let previousAurelia: Aurelia<INode>;
export default async function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
}: RenderMainArgs) {
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
  showMain();

  if (previousAurelia) {
    await previousAurelia.stop().wait();
  }

  previousAurelia = new Aurelia(element.container);
  if (element.items && element.items.length > 0) {
    previousAurelia.register(...element.items);
  } else {
    previousAurelia.register(JitHtmlBrowserConfiguration, DebugConfiguration);
  }

  if (element.components && element.components.length > 0) {
    previousAurelia.container.register(...element.components);
  }

  const isConstructable = element.state && element.state.prototype;
  let { template } = element;
  if (element.customElement) {
    const def = CustomElement.getDefinition(element.customElement);
    template = `<${def.name} ${Object.keys(def.bindables).map(
      key => `${def.bindables[key].attribute}.bind="${def.bindables[key].property}" `
    )}  ></${def.name}>`;
    previousAurelia.register(element.customElement);
  }

  let state: Constructable = class {};
  if (element.state) {
    state = isConstructable ? element.state : state;
  } else if (element.customElement) {
    state = generateKnobsFor(element.customElement);
  }

  const App = CustomElement.define({ name: 'app', template }, state as Constructable);

  let app: IViewModel<INode>;
  if ((element.customElement || element.state) && !isConstructable) {
    app = Object.assign(new App(), element.state || state);
  }

  await previousAurelia
    .app({
      host,
      component: app || App,
    })
    .start()
    .wait();
}
