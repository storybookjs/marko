import React from 'react';
import { createMemorySource, createHistory } from '@reach/router';
import { LocationProvider } from '@storybook/router';
import { DecoratorFn } from '@storybook/react';

import { Root as App } from './index';
import { PrettyFakeProvider, FakeProvider } from './FakeProvider';
import Provider from './provider';

export default {
  title: 'UI/App',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    ((StoryFn, c) => (
      <LocationProvider
        key="location.provider"
        history={createHistory(createMemorySource('/?path=/story/storyId'))}
      >
        <StoryFn {...c} />
      </LocationProvider>
    )) as DecoratorFn,
  ],
};

export const Default = () => <App provider={(new FakeProvider() as unknown) as Provider} />;
export const LoadingState = () => (
  <App provider={(new PrettyFakeProvider() as unknown) as Provider} />
);
