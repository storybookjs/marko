import React, { FunctionComponent, useMemo, useState, useCallback } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea } from '@storybook/components';
import { StoriesHash, State } from '@storybook/api';

import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarStories from './SidebarStories';
import SidebarItem from './SidebarItem';

import SidebarSearch from './SidebarSearch';

const Search = styled(SidebarSearch)({
  margin: '0 20px 1rem',
});

const Heading = styled(SidebarHeading)<SidebarHeadingProps>({
  padding: '20px 20px 12px',
});

const Stories = styled(({ className, ...rest }) => (
  <SidebarStories className={className} {...rest} />
))(({ loading }) => (loading ? { marginTop: 8, overflow: 'hidden' } : { overflow: 'hidden' }));

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
  loading?: boolean;
}

type RefType = State['refs'][keyof State['refs']];

const Ref: FunctionComponent<RefType & { storyId: string; filter: string }> = ({
  stories,
  id,
  storyId,
  filter,
}) => {
  const isLoading = !useMemo<number>(() => stories && Object.keys(stories).length, [stories]);

  return isLoading ? (
    <SidebarItem loading />
  ) : (
    <Stories key={id} stories={stories} storyId={storyId} loading={isLoading} filter={filter} />
  );
};

const Sidebar: FunctionComponent<SidebarProps> = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  loading = false,
  refs = {},
}) => {
  const [filter, setFilter] = useState('');
  const onFilter = useCallback((value: string) => {
    setFilter(value);
  }, []);

  const filterValue = filter.length > 1 ? filter : '';

  return (
    <Container className="container sidebar-container">
      <CustomScrollArea vertical>
        <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

        <Search key="filter" onChange={onFilter} />

        <Stories stories={stories} storyId={storyId} loading={loading} filter={filterValue} />
        {Object.entries(refs).map(([k, v]) => (
          <Ref key={k} {...v} storyId={storyId} filter={filterValue} />
        ))}
      </CustomScrollArea>
    </Container>
  );
};

export default Sidebar;
