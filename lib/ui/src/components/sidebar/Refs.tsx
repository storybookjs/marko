import React, { FunctionComponent, useMemo, Fragment } from 'react';

import { StoriesHash, State } from '@storybook/api';
import { styled } from '@storybook/theming';

import { RefIndicator } from './RefIndicator';
import { AuthBlock, ErrorBlock, LoaderBlock, ContentBlock } from './RefBlocks';
import { ExpanderContext, useDataset } from './Tree/State';

type Refs = State['refs'];
export type RefType = Refs[keyof Refs];
export type BooleanSet = Record<string, boolean>;
export type Item = StoriesHash[keyof StoriesHash];
export type DataSet = Record<string, Item>;
export type FilteredType = 'filtered' | 'unfiltered';

interface RefProps {
  storyId: string;
  filter: string;
  isHidden: boolean;
}

const RefHead = styled.header(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2,
  color: theme.color.darkest,
  textTransform: 'capitalize',

  lineHeight: '16px',
  paddingTop: 4,
  paddingBottom: 4,

  paddingLeft: theme.layoutMargin * 2,
  paddingRight: theme.layoutMargin * 2,
}));

const Wrapper = styled.div({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
});

export const getType = (isLoading: boolean, isAuthRequired: boolean, isError: boolean) => {
  if (isLoading) {
    return 'loading';
  }
  if (isAuthRequired) {
    return 'auth';
  }
  if (isError) {
    return 'error';
  }
  return 'ready';
};

export const Ref: FunctionComponent<RefType & RefProps> = ref => {
  const { stories, id: key, title = key, storyId, filter, isHidden = false, authUrl, error } = ref;
  const { dataSet, expandedSet, length, others, roots, setExpanded, selectedSet } = useDataset(
    stories,
    filter,
    storyId
  );

  const combo = useMemo(() => ({ setExpanded, expandedSet }), [setExpanded, expandedSet]);

  const isLoading = !length;
  const isMain = key === 'storybook_internal';
  const isError = !!error;
  const isAuthRequired = !!authUrl;

  const type = getType(isLoading, isAuthRequired, isError);

  return isHidden ? null : (
    <ExpanderContext.Provider value={combo}>
      <Wrapper data-title={title}>
        {isMain ? null : (
          <Fragment>
            <RefHead>{title}</RefHead>
            <RefIndicator {...ref} type={type} />
          </Fragment>
        )}

        {type === 'auth' && <AuthBlock id={ref.id} authUrl={authUrl} />}
        {type === 'error' && <ErrorBlock error={error} />}
        {type === 'loading' && <LoaderBlock isMain={isMain} />}
        {type === 'ready' && (
          <ContentBlock {...{ others, dataSet, selectedSet, expandedSet, roots }} />
        )}
      </Wrapper>
    </ExpanderContext.Provider>
  );
};
