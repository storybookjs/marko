import React from 'react';

import { parseKind } from '@storybook/router';
import { DocsPage } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsWrapper } from './DocsWrapper';
import { getDescriptionProps } from './Description';
import { getStoryProps } from './Story';
import { getPropsTableProps } from './Props';
import { getSourceProps } from './Source';

interface DocsPageWrapperProps {
  context: DocsContextProps;
}

const getDocsPageProps = (context: DocsContextProps) => {
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
    subtitle: selectedStory,
    descriptionProps: getDescriptionProps({}, context),
    storyProps: getStoryProps({}, context),
    propsTableProps: getPropsTableProps({}, context),
    sourceProps: getSourceProps({}, context),
  };
};

const DocsPageContainer: React.FunctionComponent = () => (
  <DocsContext.Consumer>
    {context => {
      const docsPageProps = getDocsPageProps(context);
      return <DocsPage {...docsPageProps} />;
    }}
  </DocsContext.Consumer>
);

const DocsPageWrapper: React.FunctionComponent<DocsPageWrapperProps> = ({ context }) => (
  /* eslint-disable react/destructuring-assignment */
  <DocsWrapper
    context={{ ...context, mdxKind: context.selectedKind }}
    content={DocsPageContainer}
  />
);

export { DocsPageWrapper as DocsPage };
