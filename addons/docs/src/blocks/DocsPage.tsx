import React from 'react';

import { parseKind } from '@storybook/router';
import { DocsPage as PureDocsPage, DocsPageProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsContainer } from './DocsContainer';
import { Description } from './Description';
import { Story } from './Story';
import { Preview } from './Preview';
import { Props } from './Props';
import { Source } from './Source';

enum DocsStoriesType {
  ALL = 'all',
  PRIMARY = 'primary',
  REST = 'rest',
}

interface DocsStoriesProps {
  type?: DocsStoriesType;
}

interface DocsStoryProps {
  id: string;
  name: string;
  description?: string;
}

interface StoryData {
  id: string;
  kind: string;
  name: string;
  parameters?: any;
}

const getDocsStories = (
  type: DocsStoriesType,
  { selectedKind, storyStore }: DocsContextProps
): DocsStoryProps[] => {
  let stories: StoryData[] = storyStore.raw();
  stories = stories.filter(s => s.kind === selectedKind);
  if (type !== DocsStoriesType.ALL) {
    const primary = stories.find(s => s.parameters && s.parameters.primary);
    const [first, ...rest] = stories;
    if (type === DocsStoriesType.PRIMARY) {
      stories = [primary || first];
    } else {
      stories = primary ? rest : stories.filter(s => !s.parameters || !s.parameters.primary);
    }
  }
  return stories.map(({ id, name, parameters: { notes, info } }) => ({
    id,
    name,
    description: notes || info || null,
  }));
};

const DocsStory: React.FunctionComponent<DocsStoryProps> = ({ id, name, description }) => (
  <>
    <h2>{name}</h2>
    {description && <Description markdown={description} />}
    <Preview>
      <Story id={id} />
    </Preview>
  </>
);

const DocsStories: React.FunctionComponent<DocsStoriesProps> = ({ type = DocsStoriesType.ALL }) => (
  <DocsContext.Consumer>
    {context => {
      const docsStories = getDocsStories(type, context);
      return docsStories.length > 0 ? docsStories.map(s => <DocsStory key={s.id} {...s} />) : null;
    }}
  </DocsContext.Consumer>
);

const getDocsPageProps = (context: DocsContextProps): DocsPageProps => {
  const { selectedKind, selectedStory, parameters } = context;
  const {
    hierarchyRootSeparator: rootSeparator,
    hierarchySeparator: groupSeparator,
  } = (parameters && parameters.options) || {
    hierarchyRootSeparator: '|',
    hierarchySeparator: '/',
  };

  const { groups } = parseKind(selectedKind, { rootSeparator, groupSeparator });
  const title = (groups && groups[groups.length - 1]) || selectedKind;

  return {
    title,
    subtitle: parameters && parameters.componentDescription,
  };
};

const DocsPage: React.FunctionComponent = () => (
  <DocsContext.Consumer>
    {context => {
      const docsPageProps = getDocsPageProps(context);
      return (
        <PureDocsPage {...docsPageProps}>
          <Description />
          <DocsStories type={DocsStoriesType.PRIMARY} />
          <Props />
          <DocsStories type={DocsStoriesType.REST} />
        </PureDocsPage>
      );
    }}
  </DocsContext.Consumer>
);

interface DocsPageWrapperProps {
  context: DocsContextProps;
}

const DocsPageWrapper: React.FunctionComponent<DocsPageWrapperProps> = ({ context }) => (
  /* eslint-disable react/destructuring-assignment */
  <DocsContainer context={{ ...context, mdxKind: context.selectedKind }} content={DocsPage} />
);

export { DocsPageWrapper as DocsPage };
