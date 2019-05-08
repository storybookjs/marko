import React from 'react';

import { DocsPage } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsWrapper } from './DocsWrapper';
import { getPreviewProps } from './Preview';
import { getPropsProps } from './Props';
import { getSourceProps } from './Source';

interface DocsPageWrapperProps {
  context: DocsContextProps;
}

const getDocsPageProps = (context: DocsContextProps) => {
  return {
    title: context.selectedStory,
    previewProps: getPreviewProps({}, context),
    propsProps: getPropsProps({}, context),
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
