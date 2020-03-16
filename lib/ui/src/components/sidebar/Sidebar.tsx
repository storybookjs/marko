import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea } from '@storybook/components';
import { StoriesHash } from '@storybook/api';

import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarStories from './SidebarStories';

const Heading = styled(SidebarHeading)<SidebarHeadingProps>({
  padding: '20px 20px 12px',
});

const Stories = styled(({ className, ...rest }) => (
  <SidebarStories className={className} {...rest} />
))(({ isLoading }) => (isLoading ? { marginTop: 8, overflow: 'hidden' } : { overflow: 'hidden' }));

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
  '&&&&& .os-scrollbar-handle:before': {
    left: -12,
  },
  '&&&&& .os-scrollbar-vertical': {
    right: 5,
  },
});

export interface SidebarProps {
  stories: StoriesHash;
  menu: any[];
  storyId?: string;
  menuHighlighted?: boolean;
  isLoading?: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  isLoading = false,
}) => (
  <Container className="container sidebar-container">
    <CustomScrollArea vertical>
      <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />
      <Stories stories={stories} storyId={storyId} isLoading={isLoading} />
    </CustomScrollArea>
  </Container>
);

export default Sidebar;
