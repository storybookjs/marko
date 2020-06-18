import React, { useState, FC } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { Icons } from '../../icon/icon';

type Level = 'section' | 'subsection';

export interface SectionRowProps {
  label: string;
  level: Level;
  initialExpanded?: boolean;
  colSpan: number;
}

const ExpanderIcon = styled(Icons)(({ theme }) => ({
  marginRight: 8,
  marginLeft: -10,
  marginTop: -2, // optical alignment
  height: 12,
  width: 12,
  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.3, theme.color.defaultText),
  border: 'none',
  display: 'inline-block',
}));

const FlexWrapper = styled.span<{}>(({ theme }) => ({
  display: 'flex',
  lineHeight: '20px',
  alignItems: 'center',
}));

const commonStyles = {
  width: '100%',
  cursor: 'row-resize',
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

  '&:hover': {
    backgroundColor: `${theme.background.hoverable} !important`,
    boxShadow: `${theme.color.mediumlight} 0 - 1px 0 0 inset`,
  },
}));

const Subsection = styled.td<{}>(({ theme }) => ({
  ...commonStyles,
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2 - 1,
  background: theme.background.content,

  '&:hover': {
    backgroundColor: theme.background.hoverable,
    boxShadow: `${theme.color.mediumlight} 0 - 1px 0 0 inset`,
  },
}));

export const SectionRow: FC<SectionRowProps> = ({
  level = 'section',
  label,
  children,
  initialExpanded = true,
  colSpan = 3,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const Level = level === 'subsection' ? Subsection : Section;
  // @ts-ignore
  const itemCount = children?.length || 0;
  const caption = level === 'subsection' ? `${itemCount} items` : '';
  const icon = expanded ? 'arrowdown' : 'arrowright';
  return (
    <>
      <tr onClick={(e) => setExpanded(!expanded)}>
        <Level colSpan={colSpan}>
          <FlexWrapper>
            <ExpanderIcon icon={icon} />
            {label}
            {caption}
          </FlexWrapper>
        </Level>
      </tr>
      {expanded ? children : null}
    </>
  );
};
