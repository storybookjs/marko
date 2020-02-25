import React, { FunctionComponent, useMemo, useState, useCallback, Fragment } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea, Placeholder } from '@storybook/components';
import { StoriesHash, State } from '@storybook/api';

import { Heading } from './Heading';

import { Search } from './Search';
import { filteredLength } from './Tree/utils';

import { Hr } from './Section';
import { Ref } from './Refs';

type Refs = State['refs'];
type RefType = Refs[keyof Refs];

const Container = styled.nav({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
});

const CustomScrollArea = styled(ScrollArea)({
  '.simplebar-track.simplebar-vertical': {
    right: 4,
  },
});

export interface SidebarProps {
  stories: StoriesHash;
  refs: State['refs'];
  menu: any[];
  storyId?: string;
  menuHighlighted?: boolean;
  isLoading?: boolean;
}

const useFilterState = (initial: string) => {
  const [state, setState] = useState(initial);
  const changeFilter = useCallback((value: string) => {
    setState(value);
  }, []);

  const value = state.length > 1 ? state : '';

  return [value, changeFilter] as [typeof state, typeof changeFilter];
};

const useSearchResults = (refsList: [string, RefType][], filter: string) => {
  const refsLengths = useMemo(
    () => refsList.map(([k, i]) => filteredLength(i.stories || {}, filter), 0),
    [refsList, filter]
  );
  const refsTotal = useMemo(() => refsLengths.reduce((acc, i) => acc + i, 0), [refsList, filter]);

  return { total: refsTotal || 0, list: refsLengths };
};

const useCombination = (stories: StoriesHash, refs: Refs) => {
  const merged = useMemo<Refs>(
    () => ({
      storybook_internal: { stories, title: null, id: 'storybook_internal', url: 'iframe.html' },
      ...refs,
    }),
    [refs, stories]
  );

  return useMemo(() => Object.entries(merged), [merged]);
};

const Sidebar: FunctionComponent<SidebarProps> = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  refs = {},
}) => {
  const [filter, setFilter] = useFilterState('');
  const combined = useCombination(stories, refs);
  const { total, list } = useSearchResults(combined, filter);

  const resultLess = total === 0 && filter;

  return (
    <Container className="container sidebar-container">
      <CustomScrollArea vertical>
        <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

        <Search key="filter" onChange={setFilter} />

        {resultLess ? <Placeholder>This filter resulted in 0 results</Placeholder> : null}

        <Fragment>
          {combined.map(([k, v], index) => {
            const prev = list[index - 1];

            return (
              <Fragment key={k}>
                {index === 0 || (filter && prev === 0) ? null : <Hr />}
                <Ref {...v} storyId={storyId} filter={filter} isHidden={filter && !list[index]} />
              </Fragment>
            );
          })}
        </Fragment>
      </CustomScrollArea>
    </Container>
  );
};

export default Sidebar;
