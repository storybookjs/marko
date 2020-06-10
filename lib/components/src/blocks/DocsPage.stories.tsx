import React from 'react';
import { Title, Subtitle, DocsPageWrapper } from './DocsPage';
import * as Story from './Story.stories';
import * as Preview from './Preview.stories';
import * as ArgsTable from './ArgsTable/ArgsTable.stories';
import * as Source from './Source.stories';
import * as Description from './Description.stories';

export default {
  title: 'Docs/DocsPage',
  component: DocsPageWrapper,
  parameters: {
    layout: 'fullscreen',
  },
};
export const WithSubtitle = () => (
  <DocsPageWrapper>
    <Title>DocsPage</Title>
    <Subtitle>
      What the DocsPage looks like. Meant to be QAed in Canvas tab not in Docs tab.
    </Subtitle>
    <Description.Text />
    <Preview.Single />
    <ArgsTable.Normal />
    <Source.JSX />
  </DocsPageWrapper>
);

export const Empty = () => (
  <DocsPageWrapper>
    <Story.Error />
    <ArgsTable.Error />
    <Source.SourceUnavailable />
  </DocsPageWrapper>
);

export const NoText = () => (
  <DocsPageWrapper>
    <Title>no text</Title>
    <Preview.Single />
    <ArgsTable.Normal />
    <Source.JSX />
  </DocsPageWrapper>
);

export const Text = () => (
  <DocsPageWrapper>
    <Title>Sensorium</Title>
    <Description.Text />
    <Preview.Single />
    <ArgsTable.Normal />
    <Source.JSX />
  </DocsPageWrapper>
);

export const Markdown = () => (
  <DocsPageWrapper>
    <Title>markdown</Title>
    <Description.Markdown />
    <Preview.Single />
    <ArgsTable.Normal />
    <Source.JSX />
  </DocsPageWrapper>
);
