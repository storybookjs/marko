import React, { FunctionComponent, MouseEvent, useMemo, useState, useRef } from 'react';
import { styled } from '@storybook/theming';

import { ExpanderContext, useDataset } from './Tree/State';
import { Expander } from './Tree/ListItem';
import { RefIndicator } from './RefIndicator';
import { AuthBlock, ErrorBlock, LoaderBlock, ContentBlock, EmptyBlock } from './RefBlocks';
import { getStateType, RefType } from './RefHelpers';

export interface RefProps {
  storyId: string;
  filter: string;
  isHidden: boolean;
}

const RefHead = styled.button({
  alignItems: 'center',
  background: 'transparent',
  border: 'none',
  boxSizing: 'content-box',
  cursor: 'pointer',
  display: 'flex',
  marginLeft: -20,
  padding: 0,
  paddingLeft: 20,
  position: 'relative',
  textAlign: 'left',
  width: '100%',
});

const RefTitle = styled.header(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2,
  color: theme.color.darkest,

  flex: 1,
  height: 24,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingRight: theme.layoutMargin,
  overflow: 'hidden',

  lineHeight: '24px',
}));

const Wrapper = styled.div<{ isMain: boolean }>(({ isMain }) => ({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
  marginTop: isMain ? undefined : 4,
}));

export const Ref: FunctionComponent<RefType & RefProps> = (ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const indicatorRef = useRef<HTMLElement>(null);

  const { stories, id: key, title = key, storyId, filter, isHidden = false, loginUrl, error } = ref;
  const { dataSet, expandedSet, length, others, roots, setExpanded, selectedSet } = useDataset(
    stories,
    filter,
    storyId
  );

  const handleClick = ({ target }: MouseEvent) => {
    // Don't fire if the click is from the indicator.
    if (target === indicatorRef.current || indicatorRef.current?.contains(target as Node)) return;
    setIsExpanded(!isExpanded);
  };

  const combo = useMemo(() => ({ setExpanded, expandedSet }), [setExpanded, expandedSet]);

  const isMain = key === 'storybook_internal';

  const isLoadingMain = !ref.ready && isMain;
  const isLoadingInjected = ref.type === 'auto-inject' && !ref.ready;

  const isLoading = isLoadingMain || isLoadingInjected || ref.type === 'unknown';
  const isError = !!error;
  const isEmpty = !isLoading && length === 0;
  const isAuthRequired = !!loginUrl && length === 0;

  const state = getStateType(isLoading, isAuthRequired, isError, isEmpty);

  return isHidden ? null : (
    <ExpanderContext.Provider value={combo}>
      {isMain ? null : (
        <RefHead
          aria-label={`${isExpanded ? 'Hide' : 'Show'} ${title} stories`}
          aria-expanded={isExpanded}
          type="button"
          onClick={handleClick}
        >
          <Expander className="sidebar-ref-expander" depth={0} isExpanded={isExpanded} />
          <RefTitle title={title}>{title}</RefTitle>
          <RefIndicator {...ref} state={state} ref={indicatorRef} />
        </RefHead>
      )}
      {isExpanded && (
        <Wrapper data-title={title} isMain={isMain}>
          {state === 'auth' && <AuthBlock id={ref.id} loginUrl={loginUrl} />}
          {state === 'error' && <ErrorBlock error={error} />}
          {state === 'loading' && <LoaderBlock isMain={isMain} />}
          {state === 'empty' && <EmptyBlock isMain={isMain} />}
          {state === 'ready' && (
            <ContentBlock {...{ others, dataSet, selectedSet, expandedSet, roots }} />
          )}
        </Wrapper>
      )}
    </ExpanderContext.Provider>
  );
};
