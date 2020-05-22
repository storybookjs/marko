import React from 'react';

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

export const Default = () => <App provider={(new FakeProvider() as unknown) as Provider} />;
export const LoadingState = () => (
  <App provider={(new PrettyFakeProvider() as unknown) as Provider} />
);
