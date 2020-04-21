import React, { FC } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { Args } from './types';

export interface SectionRowProps {
  section: string;
  updateArgs?: (args: Args) => void;
}

const SectionTh = styled.th<{}>(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  background: `${theme.background.app} !important`,
}));

export const SectionRow: FC<SectionRowProps> = ({ section, updateArgs }) => (
  <tr>
    <SectionTh colSpan={updateArgs ? 4 : 3}>{section}</SectionTh>
  </tr>
);
