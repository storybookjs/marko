import React, { FunctionComponent, useMemo, useState, useRef, useCallback } from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';

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

const RefHead = styled.button(({ theme }) => ({
  // Reset button
  border: 'none',
  boxSizing: 'content-box',
  cursor: 'pointer',
  position: 'relative',
  textAlign: 'left',

  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s2 - 1,

  // Similar to ListItem.tsx
  textDecoration: 'none',
  lineHeight: '16px',
  paddingTop: 4,
  paddingBottom: 4,
  paddingRight: theme.layoutMargin * 2,
  paddingLeft: 20, // 1px more padding than ListItem for optical correction
  display: 'flex',
  alignItems: 'center',
  background: 'transparent',

  marginLeft: -20,
  width: '100%',

  color:
    theme.base === 'light' ? theme.color.defaultText : transparentize(0.2, theme.color.defaultText),
  '&:hover, &:focus': {
    outline: 'none',
    color: theme.color.defaultText,
    background: theme.background.hoverable,
  },
}));

const RefTitle = styled.span(({ theme }) => ({
  display: 'block',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  overflow: 'hidden',
}));

const Wrapper = styled.div<{ isMain: boolean }>(({ isMain }) => ({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
  marginTop: isMain ? undefined : 0,
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

  const handleClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

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
        >
          <Expander
            onClick={handleClick}
            className="sidebar-ref-expander"
            depth={0}
            isExpanded={isExpanded}
          />
          <RefTitle onClick={handleClick} title={title}>
            {title}
          </RefTitle>
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
