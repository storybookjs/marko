import React, { FunctionComponent, ComponentProps } from 'react';
import { styled } from '@storybook/theming';

import { Brand } from './Brand';
import { SidebarMenu, MenuList } from './Menu';
import { SkipToContent } from './Tree/ListItem';

export interface HeadingProps {
  menuHighlighted?: boolean;
  menu: MenuList;
}

const BrandArea = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
  marginRight: 40,
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  minHeight: 22,

  '& > *': {
    maxWidth: '100%',
    height: 'auto',
    width: 'auto',
    display: 'block',
  },
}));

const HeadingWrapper = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  position: 'relative',
});

export const Heading: FunctionComponent<HeadingProps & ComponentProps<typeof HeadingWrapper>> = ({
  menuHighlighted = false,
  menu,
  ...props
}) => {
  const selectedStoryId = global.location.href.split('story/')[1];
  return (
    <HeadingWrapper {...props}>
      {selectedStoryId && (
        <SkipToContent href={`#${selectedStoryId}`}>Go to selected story</SkipToContent>
      )}
      <BrandArea>
        <Brand />
      </BrandArea>

      <SidebarMenu menu={menu} isHighlighted={menuHighlighted} />
    </HeadingWrapper>
  );
};
