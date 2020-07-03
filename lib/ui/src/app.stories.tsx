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

const Story = (args: React.ComponentProps<typeof App>) => <App {...args} />;

export const Default = Story.bind({});
Default.args = {
  provider: (new FakeProvider() as unknown) as Provider,
  history: createHistory(createMemorySource('/?path=/story/story--id')),
};

export const LoadingState = Story.bind({});
LoadingState.args = {
  ...Default.args,
  provider: (new PrettyFakeProvider() as unknown) as Provider,
};
