import React from 'react';
import { createMemorySource, createHistory } from '@reach/router';

import { Root as App } from './index';
import { PrettyFakeProvider, FakeProvider } from './FakeProvider';
import Provider from './provider';

export default {
  title: 'UI/App',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

const history = createHistory(createMemorySource('/?path=/story/story--id'));

export const Default = () => (
  <App provider={(new FakeProvider() as unknown) as Provider} history={history} />
);

export const LoadingState = () => (
  <App provider={(new PrettyFakeProvider() as unknown) as Provider} history={history} />
);
