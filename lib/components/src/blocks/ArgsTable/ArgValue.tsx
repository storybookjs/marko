import React, { FC, useState } from 'react';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { PropSummaryValue } from './types';
import { WithTooltipPure } from '../../tooltip/WithTooltip';
import { Icons } from '../../icon/icon';
import { SyntaxHighlighter } from '../../syntaxhighlighter/syntaxhighlighter';
import { codeCommon } from '../../typography/shared';

interface ArgValueProps {
  value?: PropSummaryValue;
}

interface ArgTextProps {
  text: string;
}

interface ArgSummaryProps {
  value: PropSummaryValue;
}

const Text = styled.span(({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s2 - 1,
}));

const Expandable = styled.div<{}>(codeCommon, ({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  color: theme.color.secondary,
  margin: 0,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
}));

const Detail = styled.div<{ width: string }>(({ theme, width }) => ({
  width,
  minWidth: 200,
  maxWidth: 800,
  padding: 15,
  // Dont remove the mono fontFamily here even if it seem useless, this is used by the browser to calculate the length of a "ch" unit.
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s2 - 1,
  // Most custom stylesheet will reset the box-sizing to "border-box" and will break the tooltip.
  boxSizing: 'content-box',

  '& code': {
    padding: '0 !important',
  },
}));

const ArrowIcon = styled(Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  marginLeft: 4,
});

const EmptyArg = () => {
  return <span>-</span>;
};

const ArgText: FC<ArgTextProps> = ({ text }) => {
  return <Text>{text}</Text>;
};

const calculateDetailWidth = memoize(1000)((detail: string): string => {
  const lines = detail.split(/\r?\n/);

  return `${Math.max(...lines.map((x) => x.length))}ch`;
});

const ArgSummary: FC<ArgSummaryProps> = ({ value }) => {
  const { summary, detail } = value;

  const [isOpen, setIsOpen] = useState(false);
  // summary is used for the default value
  // below check fixes not displaying default values for boolean typescript vars
  const summaryAsString =
    summary !== undefined && summary !== null && typeof summary.toString === 'function'
      ? summary.toString()
      : summary;
  if (detail == null) {
    return <ArgText text={summaryAsString} />;
  }

  return (
    <WithTooltipPure
      closeOnClick
      trigger="click"
      placement="bottom"
      tooltipShown={isOpen}
      onVisibilityChange={(isVisible) => {
        setIsOpen(isVisible);
      }}
      tooltip={
        <Detail width={calculateDetailWidth(detail)}>
          <SyntaxHighlighter language="jsx" format={false}>
            {detail}
          </SyntaxHighlighter>
        </Detail>
      }
    >
      <Expandable className="sbdocs-expandable">
        <span>{summaryAsString}</span>
        <ArrowIcon icon={isOpen ? 'arrowup' : 'arrowdown'} />
      </Expandable>
    </WithTooltipPure>
  );
};

export const ArgValue: FC<ArgValueProps> = ({ value }) => {
  return value == null ? <EmptyArg /> : <ArgSummary value={value} />;
};
