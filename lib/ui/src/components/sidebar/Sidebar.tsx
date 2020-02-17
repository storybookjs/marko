import React, { FunctionComponent, useMemo } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea } from '@storybook/components';
import { StoriesHash, State } from '@storybook/api';

import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarStories from './SidebarStories';
import SidebarItem from './SidebarItem';

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

const Ref: FunctionComponent<RefType & { storyId: string }> = ({ stories, id, storyId }) => {
  const isLoading = !useMemo<number>(() => stories && Object.keys(stories).length, [stories]);

  return isLoading ? (
    <SidebarItem loading />
  ) : (
    <Stories key={id} stories={stories} storyId={storyId} loading={isLoading} />
  );
};

const Sidebar: FunctionComponent<SidebarProps> = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  loading = false,
  refs = {},
}) => (
  <Container className="container sidebar-container">
    <CustomScrollArea vertical>
      <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />
      <Stories stories={stories} storyId={storyId} loading={loading} />
      {Object.entries(refs).map(([k, v]) => (
        <Ref key={k} {...v} storyId={storyId} />
      ))}
    </CustomScrollArea>
  </Container>
);

export default Sidebar;
