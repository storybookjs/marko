import React, { useState, FC } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { Icons } from '../../icon/icon';

type Level = 'section' | 'subsection';

export interface SectionRowProps {
  caption: string;
  level: Level;
  initialExpanded?: boolean;
  colSpan: number;
}

const ExpanderIcon = styled(Icons)(({ theme }) => ({
  marginRight: 8,
  // marginLeft: -10,
  // marginTop: -2, // optical alignment
  height: 12,
  width: 12,
  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.3, theme.color.defaultText),
  border: 'none',
  display: 'inline-block',
}));

const commonStyles = {
  width: '100%',
  lineHeight: '24px',
  layout: 'flex',
};

const Section = styled.td<{}>(({ theme }) => ({
  ...commonStyles,
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  background: `${theme.background.app} !important`,
}));

const Subsection = styled.td<{}>(({ theme }) => ({
  ...commonStyles,
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s1 - 1,
  background: theme.background.content,
}));

export const SectionRow: FC<SectionRowProps> = ({
  level = 'section',
  caption,
  children,
  initialExpanded = true,
  colSpan = 3,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const Level = level === 'subsection' ? Subsection : Section;
  const icon = expanded ? 'arrowdown' : 'arrowright';
  return (
    <>
      <tr onClick={(e) => setExpanded(!expanded)}>
        <Level colSpan={colSpan}>
          <ExpanderIcon icon={icon} />
          {caption}
        </Level>
      </tr>
      {expanded ? children : null}
    </>
  );
};
