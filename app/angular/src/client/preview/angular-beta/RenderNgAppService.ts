/* eslint-disable no-undef */
import { enableProdMode, NgModule, PlatformRef, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import dedent from 'ts-dedent';

import { BehaviorSubject, Subject } from 'rxjs';
import { deprecate } from 'util';
import { ICollection, StoryFnAngularReturnType } from '../types';
import { Parameters } from '../types-6-0';
import { storyPropsProvider } from './app.token';
import { createComponentClassFromStoryComponent } from './ComponentClassFromStoryComponent';
import { createComponentClassFromStoryTemplate } from './ComponentClassFromStoryTemplate';
import { isComponentAlreadyDeclaredInModules } from './NgModulesAnalyzer';
import { isDeclarable } from './NgComponentAnalyzer';

const deprecatedStoryComponentWarning = deprecate(
  () => {},
  dedent`\`component\` story return value is deprecated, and will be removed in Storybook 7.0.
        Instead, use \`export const default = () => ({ component: AppComponent });\`
        or
        \`\`\`
        export const Primary: Story = () => ({});
        Primary.parameters = { component: AppComponent };
        \`\`\`
        Read more at 
        - https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-angular-story-component).
        - https://storybook.js.org/docs/angular/writing-stories/parameters
      `
);

/**
 * Bootstrap angular application and allows to change the rendering dynamically
 * To be used as a singleton so has to set global properties of render function
 */
export class RenderNgAppService {
  private static instance: RenderNgAppService;

  public static SELECTOR_STORYBOOK_WRAPPER = 'storybook-wrapper';

  public static getInstance() {
    if (!RenderNgAppService.instance) {
      RenderNgAppService.instance = new RenderNgAppService();
    }
    return RenderNgAppService.instance;
  }

  public static getNgModuleMetadata = (
    {
      storyFnAngular,
      parameters,
    }: {
      storyFnAngular: StoryFnAngularReturnType;
      parameters: Parameters;
    },
    storyProps$: Subject<ICollection>
  ): NgModule => {
    const {
      component: storyComponent,
      props,
      styles,
      template,
      moduleMetadata = {},
    } = storyFnAngular;

    if (storyComponent) {
      deprecatedStoryComponentWarning();
    }
    const component = storyComponent ?? parameters.component;

    const ComponentToInject = createComponentToInject({ component, props, styles, template });

    // Look recursively (deep) if the component is not already declared by an import module
    const requiresComponentDeclaration =
      isDeclarable(component) &&
      !isComponentAlreadyDeclaredInModules(
        component,
        moduleMetadata.declarations,
        moduleMetadata.imports
      );

    return {
      declarations: [
        ...(requiresComponentDeclaration ? [component] : []),
        ComponentToInject,
        ...(moduleMetadata.declarations ?? []),
      ],
      imports: [BrowserModule, ...(moduleMetadata.imports ?? [])],
      providers: [storyPropsProvider(storyProps$), ...(moduleMetadata.providers ?? [])],
      entryComponents: [...(moduleMetadata.entryComponents ?? [])],
      schemas: [...(moduleMetadata.schemas ?? [])],
      bootstrap: [ComponentToInject],
    };
  };

  private platform: PlatformRef;

  private staticRoot = document.getElementById('root');

  // Observable to change the properties dynamically without reloading angular module&component
  private storyProps$: Subject<ICollection | undefined>;

  constructor() {
    // Adds DOM element that angular will use as bootstrap component
    const storybookWrapperElement = document.createElement(
      RenderNgAppService.SELECTOR_STORYBOOK_WRAPPER
    );
    this.staticRoot.innerHTML = '';
    this.staticRoot.appendChild(storybookWrapperElement);

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
  }

  /**
   * Bootstrap main angular module with main component or send only new `props` with storyProps$
   *
   * @param storyFn {StoryFn<StoryFnAngularReturnType>}
   * @param forced {boolean} If :
   * - true render will only use the StoryFn `props' in storyProps observable that will update sotry's component/template properties. Improves performance without reloading the whole module&component if props changes
   * - false fully recharges or initializes angular module & component
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
    if (forced && this.storyProps$) {
      this.storyProps$.next(storyFnAngular.props);
      return;
    }

    // Complete last BehaviorSubject and create a new one for the current module
    if (this.storyProps$) {
      this.storyProps$.complete();
    }
    this.storyProps$ = new BehaviorSubject<ICollection>(storyFnAngular.props);

    await this.platform.bootstrapModule(
      createModuleFromMetadata(
        RenderNgAppService.getNgModuleMetadata({ storyFnAngular, parameters }, this.storyProps$)
      )
    );
  }
}

const createModuleFromMetadata = (ngModule: NgModule) => {
  @NgModule(ngModule)
  class StoryBookAppModule {}
  return StoryBookAppModule;
};

/**
 * Create a specific component according to whether the story uses a template or a component.
 */
const createComponentToInject = ({
  template,
  styles,
  component,
  props,
}: {
  template: string;
  styles: string[];
  component: unknown;
  props: ICollection;
}): Type<any> => {
  // Template has priority over the component
  const isCreatingComponentFromTemplate = !!template;

  return isCreatingComponentFromTemplate
    ? createComponentClassFromStoryTemplate(template, styles)
    : createComponentClassFromStoryComponent(component, props);
};
