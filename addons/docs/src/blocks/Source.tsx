import React, { FC, useContext } from 'react';
import {
  Source as PureSource,
  SourceError,
  SourceProps as PureSourceProps,
} from '@storybook/components';
import { StoryId } from '@storybook/api';
import { logger } from '@storybook/client-logger';

import { DocsContext, DocsContextProps } from './DocsContext';
import { SourceContext, SourceContextProps } from './SourceContainer';
import { CURRENT_SELECTION } from './types';

import { enhanceSource } from './enhanceSource';

enum SourceType {
  /**
   * AUTO is the default
   *
   * Use the CODE logic if:
   * - the user has set a custom source snippet in `docs.source.code` story parameter
   * - the story is not an args-based story
   *
   * Use the DYNAMIC rendered snippet if the story is an args story
   */
  AUTO = 'auto',

  /**
   * Render the code extracted by source-loader
   */
  CODE = 'code',

  /**
   * Render dynamically-rendered source snippet from the story's virtual DOM (currently React only)
   */
  DYNAMIC = 'dynamic',
}

interface CommonProps {
  language?: string;
  dark?: boolean;
  code?: string;
}

type SingleSourceProps = {
  id: string;
} & CommonProps;

type MultiSourceProps = {
  ids: string[];
} & CommonProps;

type CodeProps = {
  code: string;
} & CommonProps;

type NoneProps = CommonProps;

type SourceProps = SingleSourceProps | MultiSourceProps | CodeProps | NoneProps;

const getSnippet = (
  storyId: StoryId,
  sourceContext: SourceContextProps,
  docsContext: DocsContextProps
): string => {
  const { sources } = sourceContext;
  const { storyStore } = docsContext;

  const snippet = sources && sources[storyId];
  const data = storyStore?.fromId(storyId);

  if (data) {
    const { parameters } = data;
    // eslint-disable-next-line no-underscore-dangle
    const isArgsStory = parameters.__isArgsStory;
    const type = parameters.docs?.source?.type || SourceType.AUTO;

    // if user has hard-coded the snippet, that takes precedence
    const userCode = parameters.docs?.source?.code;
    if (userCode) return userCode;

    // if user has explicitly set this as dynamic, use snippet
    if (type === SourceType.DYNAMIC) {
      return snippet || '';
    }

    // if this is an args story and there's a snippet
    if (type === SourceType.AUTO && snippet && isArgsStory) {
      return snippet;
    }

    // otherwise, use the source code logic
    const enhanced = enhanceSource(data) || data.parameters;
    return enhanced?.docs?.source?.code || '';
  }
  // Fallback if we can't get the story data for this story
  logger.warn(`Unable to find source for story ID '${storyId}'`);
  return snippet || '';
};

export const getSourceProps = (
  props: SourceProps,
  docsContext: DocsContextProps,
  sourceContext: SourceContextProps
): PureSourceProps => {
  const { id: currentId } = docsContext;

  const codeProps = props as CodeProps;
  const singleProps = props as SingleSourceProps;
  const multiProps = props as MultiSourceProps;

  let source = codeProps.code; // prefer user-specified code
  if (!source) {
    const targetId =
      singleProps.id === CURRENT_SELECTION || !singleProps.id ? currentId : singleProps.id;
    const targetIds = multiProps.ids || [targetId];
    source = targetIds
      .map((storyId) => getSnippet(storyId, sourceContext, docsContext))
      .join('\n\n');
  }
  return source
    ? { code: source, language: props.language || 'jsx', dark: props.dark || false }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
export const Source: FC<SourceProps> = (props) => {
  const sourceContext = useContext(SourceContext);
  const docsContext = useContext(DocsContext);
  const sourceProps = getSourceProps(props, docsContext, sourceContext);
  return <PureSource {...sourceProps} />;
};
