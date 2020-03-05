import { styled } from '@storybook/theming';

export const Hr = styled.hr(({ theme }) => ({
  border: '0 none',
  height: 0,
  marginBottom: 0,
  borderTop: `1px solid ${theme.color.mediumlight}`,
}));

export const Section = styled.section();
