import { opacify } from 'polished';
import { styled } from '@storybook/theming';

export const Hr = styled.hr(({ theme }) => ({
  border: '0 none',
  height: 0,
  borderTop: `1px solid ${opacify(0.1, theme.appBorderColor)}`,
}));

export const Section = styled.section(({ theme }) => ({
  '& + &': {
    marginTop: theme.layoutMargin * 2,
  },
  '&:last-of-type': {
    marginBottom: theme.layoutMargin * 4,
  },
}));
