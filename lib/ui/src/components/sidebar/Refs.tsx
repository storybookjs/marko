import React, { FunctionComponent, useMemo } from 'react';
import { styled } from '@storybook/theming';

import { ExpanderContext, useDataset } from './Tree/State';
import { RefIndicator } from './RefIndicator';
import { AuthBlock, ErrorBlock, LoaderBlock, ContentBlock } from './RefBlocks';
import { getType, RefType } from './RefHelpers';

export interface RefProps {
  storyId: string;
  filter: string;
  isHidden: boolean;
}

const RefHead = styled.div({
  display: 'flex',
});

const RefTitle = styled.header(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2,
  color: theme.color.darkest,
  textTransform: 'capitalize',

  flex: 1,
  height: 24,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingRight: theme.layoutMargin,
  overflow: 'hidden',

  lineHeight: '24px',
}));

const Wrapper = styled.div({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
});

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
      {isMain ? null : (
        <RefHead>
          <RefTitle title={title}>{title}</RefTitle>
          <RefIndicator {...ref} type={type} />
        </RefHead>
      )}
      <Wrapper data-title={title}>
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
