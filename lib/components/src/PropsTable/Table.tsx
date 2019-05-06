import React from 'react';
import { styled } from '@storybook/theming';

export const Table = styled.table({
  width: '100%',
  textAlign: 'left',
  borderCollapse: 'collapse',
  borderLeft: '0px',
  borderRight: '0px',
});

export const Thead = styled.thead(({ theme }) => ({
  textTransform: 'capitalize',
  color: '#ffffff', // theme.color.textInverseColor,
  backgroundColor: theme.color.darkest,
}));

export const Tbody = styled.tbody();

export const Th = styled.th({
  paddingTop: '.5rem',
  paddingBottom: '.5rem',
});

export const Tr = styled.tr({});

export const Td = styled.td(({ theme }) => ({
  color: theme.color.defaultText,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #cccccc',
}));
