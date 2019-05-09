import React from 'react';
import { styled } from '@storybook/theming';

export const Table = styled.table({
  width: '100%',
  textAlign: 'left',
  borderCollapse: 'collapse',
  borderLeft: '0px',
  borderRight: '0px',
});

export const Thead = styled.thead();

export const Tbody = styled.tbody();

export const Th = styled.th(({ theme }) => ({
  paddingTop: '.5rem',
  paddingBottom: '.5rem',
  textTransform: 'capitalize',
  color: theme.color.lightest,
  backgroundColor: theme.color.darkest,
}));

export const Tr = styled.tr({});

export const Td = styled.td(({ theme }) => ({
  color: theme.color.darkest,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #cccccc',
}));
