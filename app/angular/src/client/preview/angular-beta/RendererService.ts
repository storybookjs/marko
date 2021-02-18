/* eslint-disable no-undef */
import { enableProdMode, PlatformRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { BehaviorSubject, Subject } from 'rxjs';
import { ICollection, StoryFnAngularReturnType } from '../types';
import { Parameters } from '../types-6-0';
import { createStorybookModule, getStorybookModuleMetadata } from './StorybookModule';

/**
 * Bootstrap angular application and allows to change the rendering dynamically
 * To be used as a singleton so has to set global properties of render function
 */
export class RendererService {
  private static instance: RendererService;

  public static SELECTOR_STORYBOOK_WRAPPER = 'storybook-wrapper';

  public static getInstance() {
    if (!RendererService.instance) {
      RendererService.instance = new RendererService();
    }
    return RendererService.instance;
  }

  public platform: PlatformRef;

  private staticRoot = document.getElementById('root');

  // Observable to change the properties dynamically without reloading angular module&component
  private storyProps$: Subject<ICollection | undefined>;

  private previousStoryFnAngular: StoryFnAngularReturnType = {};

  constructor() {
    if (typeof NODE_ENV === 'string' && NODE_ENV !== 'development') {
      try {
        enableProdMode();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug(e);
      }
    }
    // platform should be set after enableProdMode()
    this.platform = platformBrowserDynamic();
    this.initAngularBootstrapElement();
  }

  /**
   * Bootstrap main angular module with main component or send only new `props` with storyProps$
   *
   * @param storyFnAngular {StoryFnAngularReturnType}
   * @param forced {boolean} If :
   * - true render will only use the StoryFn `props' in storyProps observable that will update sotry's component/template properties. Improves performance without reloading the whole module&component if props changes
   * - false fully recharges or initializes angular module & component
   * @param parameters {Parameters}
   */
  public async render({
    storyFnAngular,
    forced,
    parameters,
  }: {
    storyFnAngular: StoryFnAngularReturnType;
    forced: boolean;
    parameters: Parameters;
  }) {
    if (!this.fullRendererRequired(storyFnAngular, forced)) {
      this.storyProps$.next(storyFnAngular.props);

      return;
    }

    // Complete last BehaviorSubject and create a new one for the current module
    if (this.storyProps$) {
      this.storyProps$.complete();
    }
    this.storyProps$ = new BehaviorSubject<ICollection>(storyFnAngular.props);

    this.initAngularBootstrapElement();
    await this.platform.bootstrapModule(
      createStorybookModule(
        getStorybookModuleMetadata({ storyFnAngular, parameters }, this.storyProps$)
      )
    );
  }

  private initAngularBootstrapElement() {
    // Adds DOM element that angular will use as bootstrap component
    const storybookWrapperElement = document.createElement(
      RendererService.SELECTOR_STORYBOOK_WRAPPER
    );
    this.staticRoot.innerHTML = '';
    this.staticRoot.appendChild(storybookWrapperElement);
  }

  private fullRendererRequired(storyFnAngular: StoryFnAngularReturnType, forced: boolean) {
    const { previousStoryFnAngular } = this;
    this.previousStoryFnAngular = storyFnAngular;

    const hasChangedTemplate =
      !!storyFnAngular?.template && previousStoryFnAngular?.template !== storyFnAngular.template;

    return !forced || !this.storyProps$ || hasChangedTemplate;
  }
}
