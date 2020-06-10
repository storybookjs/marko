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
    <Description.Text {...Description.Text.args} />
    <Preview.Single {...Preview.Single.args} />
    <ArgsTable.Normal {...ArgsTable.Normal.args} />
    <Source.JSX {...Source.JSX.args} />
  </DocsPageWrapper>
);

export const Empty = () => (
  <DocsPageWrapper>
    <Story.Error {...Story.Error.args} />
    <ArgsTable.Error {...ArgsTable.Error.args} />
    <Source.SourceUnavailable {...Source.SourceUnavailable.args} />
  </DocsPageWrapper>
);

export const NoText = () => (
  <DocsPageWrapper>
    <Title>no text</Title>
    <Preview.Single {...Preview.Single.args} />
    <ArgsTable.Normal {...ArgsTable.Normal.args} />
    <Source.JSX {...Source.JSX.args} />
  </DocsPageWrapper>
);

export const Text = () => (
  <DocsPageWrapper>
    <Title>Sensorium</Title>
    <Description.Text {...Description.Text.args} />
    <Preview.Single {...Preview.Single.args} />
    <ArgsTable.Normal {...ArgsTable.Normal.args} />
    <Source.JSX {...Source.JSX.args} />
  </DocsPageWrapper>
);

export const Markdown = () => (
  <DocsPageWrapper>
    <Title>markdown</Title>
    <Description.Markdown {...Description.Markdown.args} />
    <Preview.Single {...Preview.Single.args} />
    <ArgsTable.Normal {...ArgsTable.Normal.args} />
    <Source.JSX {...Source.JSX.args} />
  </DocsPageWrapper>
);
