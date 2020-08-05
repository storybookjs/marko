import { Component, FunctionComponent } from 'react';
import {
  Args as DefaultArgs,
  ArgTypes,
  Parameters,
  DecoratorFunction,
  StoryContext,
} from '@storybook/addons';
import { StoryFnReactReturnType } from './types';

// Base types
interface Annotations<Args, StoryFnReturnType> {
  args?: Partial<Args>;
  argTypes?: ArgTypes;
  parameters?: Parameters;
  decorators?: DecoratorFunction<StoryFnReturnType>[];
}

interface BaseMeta<ComponentType> {
  title: string;
  component?: ComponentType;
  subcomponents?: Record<string, ComponentType>;
}

interface BaseStory<Args, StoryFnReturnType> {
  (args: Args, context: StoryContext): StoryFnReturnType;
  storyName?: string;
}

// Re-export generic types
export { DefaultArgs as Args, ArgTypes, Parameters, StoryContext };

// React specific types
type ReactComponent = Component | FunctionComponent<any>;
type ReactReturnType = StoryFnReactReturnType;

export type Decorator = DecoratorFunction<ReactReturnType>;

export type Meta<Args = DefaultArgs> = BaseMeta<ReactComponent> &
  Annotations<Args, ReactReturnType>;

export type Story<Args = DefaultArgs> = BaseStory<Args, ReactReturnType> &
  Annotations<Args, ReactReturnType>;
