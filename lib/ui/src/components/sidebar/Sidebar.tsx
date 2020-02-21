import React, { FunctionComponent, useMemo, useState, useCallback, Fragment } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea, Placeholder } from '@storybook/components';
import { StoriesHash, State } from '@storybook/api';

import { opacify } from 'polished';
import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarStories from './SidebarStories';
import SidebarItem from './SidebarItem';

import Search from './SidebarSearch';
import { filteredLength } from './treeview/utils';

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

const RefHead = styled.div(({ theme }) => ({
  // margin: `0 ${theme.layoutMargin * 2}px`,
  // padding: `${theme.layoutMargin}px 0`,
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin * 2,
}));

const Hr = styled.hr(({ theme }) => ({
  border: '0 none',
  height: 0,
  borderTop: `1px solid ${opacify(0.1, theme.appBorderColor)}`,
}));

const Ref: FunctionComponent<RefType & { storyId: string; filter: string }> = ({
  stories,
  title,
  id,
  storyId,
  filter,
}) => {
  const isLoading = !useMemo<number>(() => stories && Object.keys(stories).length, [stories]);

  return (
    <div>
      <RefHead>{title || id}</RefHead>
      {isLoading ? (
        <SidebarItem loading />
      ) : (
        <Stories key={id} stories={stories} storyId={storyId} loading={isLoading} filter={filter} />
      )}
    </div>
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
  const list = useMemo(() => Object.entries(refs), [refs]);
  const storiesLength = useMemo(() => filteredLength(stories, filter), [stories, filter]);
  const refsLengths = useMemo(
    () => list.map(([k, i]) => filteredLength(i.stories || {}, filter), 0),
    [list, filter]
  );
  const refsTotal = useMemo(() => refsLengths.reduce((acc, i) => acc + i, 0), [list, filter]);
  const total = storiesLength + refsTotal || 0;

  return (
    <Container className="container sidebar-container">
      <CustomScrollArea vertical>
        <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

        <Search key="filter" onChange={onFilter} />

        {total === 0 && filter.length >= 2 ? (
          <Placeholder>This filter resulted in 0 results</Placeholder>
        ) : (
          <Fragment>
            {storiesLength ? (
              <Stories stories={stories} storyId={storyId} loading={loading} filter={filterValue} />
            ) : null}

            {list.map(([k, v], index) => {
              const prev = index === 0 ? storiesLength : refsLengths[index];

              return filter.length >= 2 && !refsLengths[index] ? null : (
                <Fragment key={k}>
                  {filter.length >= 2 && !prev ? null : <Hr />}
                  <Ref {...v} storyId={storyId} filter={filterValue} />
                </Fragment>
              );
            })}
          </Fragment>
        )}
      </CustomScrollArea>
    </Container>
  );
};

export default Sidebar;
