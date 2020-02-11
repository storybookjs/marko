import React from 'react';

import { Root as App } from './index';
import { PrettyFakeProvider, FakeProvider } from './FakeProvider';

export default {
  title: 'UI/Layout/App',
  component: App,
};

export const Default = () => <App provider={new FakeProvider()} />;
export const LoadingState = () => <App provider={new PrettyFakeProvider()} />;
