import React from 'react';
import global from 'global';

import { parseKind } from '@storybook/router';
import { DocsPage } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsWrapper } from './DocsWrapper';
import { getPreviewProps } from './Preview';
import { getPropsTableProps } from './Props';
import { getSourceProps } from './Source';

interface DocsPageWrapperProps {
  context: DocsContextProps;
}

type Notes = string | any;
type Info = string | any;
type DocgenInfo = any;

interface CaptionParams {
  notes?: Notes;
  info?: Info;
  docgenInfo?: DocgenInfo;
}

const getNotes = (notes?: Notes) =>
  notes && (typeof notes === 'string' ? notes : notes.markdown || notes.text);

const getInfo = (info?: Info) => info && (typeof info === 'string' ? info : info.text);

const getDescription = (docgenInfo?: DocgenInfo) => (docgenInfo && docgenInfo.description) || '';

const getCaption = ({ notes = null, info = null, docgenInfo = null }: CaptionParams) => (
  <>
    <p>{getNotes(notes) || getInfo(info)}</p>
    <p>{getDescription(docgenInfo)}</p>
  </>
);

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
  const { notes, info } = parameters;

  const validMatches = [title, selectedStory];
  const fileInfo = Object.values(global.STORYBOOK_REACT_CLASSES || {}).find(f =>
    validMatches.includes(f.name)
  );
  const { docgenInfo } = fileInfo || {};
  return {
    title,
    subtitle: selectedStory,
    caption: getCaption({ notes, info, docgenInfo }),
    previewProps: getPreviewProps({}, context),
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
