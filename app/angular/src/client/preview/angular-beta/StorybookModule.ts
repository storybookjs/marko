import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import dedent from 'ts-dedent';

import { Subject } from 'rxjs';
import { deprecate } from 'util';
import { ICollection, StoryFnAngularReturnType } from '../types';
import { Parameters } from '../types-6-0';
import { storyPropsProvider } from './StorybookProvider';
import { createComponentClassFromStoryComponent } from './ComponentClassFromStoryComponent';
import { createComponentClassFromStoryTemplate } from './ComponentClassFromStoryTemplate';
import { isComponentAlreadyDeclaredInModules } from './utils/NgModulesAnalyzer';
import { isDeclarable } from './utils/NgComponentAnalyzer';

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

export const getStorybookModuleMetadata = (
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

  const ComponentToInject = createComponentToInject({
    component,
    props,
    styles,
    template,
  });

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

export const createStorybookModule = (ngModule: NgModule): Type<unknown> => {
  @NgModule(ngModule)
  class StorybookModule {}
  return StorybookModule;
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
