import React, { ComponentProps, FunctionComponent, MouseEvent, useState } from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import refractor from 'refractor/core';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import { formatter } from './formatter';

// refractor.register(require('refractor/lang/css'));
// refractor.register(require('refractor/lang/css-extras'));

refractor.register(require('refractor/lang/js-extras'));
refractor.register(require('refractor/lang/jsx'));
refractor.register(require('refractor/lang/tsx'));
refractor.register(require('refractor/lang/typescript'));
refractor.register(require('refractor/lang/jsdoc'));
refractor.register(require('refractor/lang/json'));
refractor.register(require('refractor/lang/json5'));
refractor.register(require('refractor/lang/bash'));
refractor.register(require('refractor/lang/markup'));
refractor.register(require('refractor/lang/markdown'));

const themedSyntax = memoize(2)(theme =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

export interface WrapperProps {
  bordered?: boolean;
  padded?: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    color: theme.color.defaultText,
  }),
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.borderRadius,
          background: theme.background.content,
        }
      : {}
);

const Scroller = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))(
  {
    position: 'relative',
  },
  ({ theme }) => ({
    '& code': {
      paddingRight: theme.layoutMargin,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);

export interface PreProps {
  padded?: boolean;
}

const Pre = styled.pre<PreProps>(({ theme, padded }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  margin: 0,
  padding: padded ? theme.layoutMargin : 0,
}));

const Code = styled.code({
  flex: 1,
  paddingRight: 0,
  opacity: 1,
});

export interface SyntaxHighlighterProps {
  language: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  className?: string;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

type ReactSyntaxHighlighterProps = ComponentProps<typeof ReactSyntaxHighlighter>;

type Props = SyntaxHighlighterProps & ReactSyntaxHighlighterProps;
export const SyntaxHighlighter: FunctionComponent<Props> = ({
  children,
  language = 'jsx',
  copyable = false,
  bordered = false,
  padded = false,
  format = true,
  className = null,
  ...rest
}) => {
  const [copied, setCopied] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = children;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();

    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  return children ? (
    <Wrapper bordered={bordered} padded={padded} className={className}>
      <Scroller>
        <ReactSyntaxHighlighter
          padded={padded || bordered}
          language={language}
          useInlineStyles={false}
          PreTag={Pre}
          CodeTag={Code}
          lineNumberContainerStyle={{}}
          {...rest}
        >
          {format ? formatter((children as string).trim()) : (children as string).trim()}
        </ReactSyntaxHighlighter>
      </Scroller>

      {copyable ? (
        <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick }]} />
      ) : null}
    </Wrapper>
  ) : null;
};
