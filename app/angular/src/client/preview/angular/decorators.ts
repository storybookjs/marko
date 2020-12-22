/* eslint-disable no-param-reassign */
import { Type } from '@angular/core';
import { DecoratorFunction } from '@storybook/addons';
import { computesTemplateFromComponent } from '../angular-beta/ComputesTemplateFromComponent';
import { isComponent } from '../angular-beta/utils/NgComponentAnalyzer';
import { NgModuleMetadata, StoryFnAngularReturnType } from '../types';

export const moduleMetadata = (metadata: Partial<NgModuleMetadata>) => (storyFn: () => any) => {
  const story = storyFn();
  const storyMetadata = story.moduleMetadata || {};
  metadata = metadata || {};

  return {
    ...story,
    moduleMetadata: {
      declarations: [...(metadata.declarations || []), ...(storyMetadata.declarations || [])],
      entryComponents: [
        ...(metadata.entryComponents || []),
        ...(storyMetadata.entryComponents || []),
      ],
      imports: [...(metadata.imports || []), ...(storyMetadata.imports || [])],
      schemas: [...(metadata.schemas || []), ...(storyMetadata.schemas || [])],
      providers: [...(metadata.providers || []), ...(storyMetadata.providers || [])],
    },
  };
};

export const componentWrapperDecorator = (
  element: Type<unknown> | ((story: string) => string)
): DecoratorFunction<StoryFnAngularReturnType> => (storyFn) => {
  const story = storyFn();

  const template = isComponent(element)
    ? computesTemplateFromComponent(element, {}, story.template)
    : element(story.template);

  return { ...story, template };
};
