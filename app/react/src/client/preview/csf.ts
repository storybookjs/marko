import { Component, FunctionComponent } from 'react';
import { Args, ArgTypes, Parameters, DecoratorFunction, StoryContext } from '@storybook/addons';
import { StoryFnReactReturnType } from './types';

// Base types
interface Annotations<ArgsType, StoryFnReturnType> {
  args?: ArgsType;
  argTypes?: ArgTypes;
  parameters?: Parameters;
  decorators?: DecoratorFunction<StoryFnReturnType>[];
}

interface BaseMeta<ComponentType> {
  title: string;
  component?: ComponentType;
  subcomponents?: Record<string, ComponentType>;
}

interface BaseStory<ArgsType, StoryFnReturnType> {
  (args: ArgsType, context: StoryContext): StoryFnReturnType;
}

// Re-export generic types
export { Args, ArgTypes, Parameters, StoryContext };

// React specific types
type ReactComponent = Component | FunctionComponent<any>;
type ReactReturnType = StoryFnReactReturnType;

export type Decorator = DecoratorFunction<ReactReturnType>;

export type Meta<ArgsType = Args> = BaseMeta<ReactComponent> &
  Annotations<ArgsType, ReactReturnType>;

export type Story<ArgsType = Args> = BaseStory<ArgsType, ReactReturnType> &
  Annotations<ArgsType, ReactReturnType>;
