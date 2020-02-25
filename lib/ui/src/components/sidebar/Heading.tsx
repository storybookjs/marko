import React, { ComponentProps, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { TooltipLinkList } from '@storybook/components';
import { Brand } from './Brand';
import { SidebarMenu } from './Menu';

export interface HeadingProps {
  menuHighlighted?: boolean;
  menu: ComponentProps<typeof TooltipLinkList>['links'];
  className?: string;
}

const BrandArea = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
  marginRight: theme.layoutMargin,
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  paddingTop: 3,
  paddingBottom: 3,
  minHeight: 28,

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
  padding: '20px 20px 12px',
});

export const Heading: FunctionComponent<HeadingProps> = ({
  menuHighlighted = false,
  menu,
  ...props
}) => {
  return (
    <HeadingWrapper {...props}>
      <BrandArea>
        <Brand />
      </BrandArea>

      <SidebarMenu menu={menu} isHighlighted={menuHighlighted} />
    </HeadingWrapper>
  );
};
