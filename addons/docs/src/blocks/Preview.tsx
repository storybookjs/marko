import React, { useState, ReactElement, ReactNodeArray } from 'react';
import {
  ActionBar,
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
} from '@storybook/components';
import { Story } from './Story';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type PreviewProps = PurePreviewProps & {
  withSource?: SourceState;
};

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    children,
    ...props
  }: PreviewProps & { children?: React.ReactNode },
  { storyStore }: DocsContextProps
): PurePreviewProps => {
  const extraProps = {};
  if (withSource === SourceState.NONE && !children) {
    return props;
  }
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const childWithId: React.ReactElement = childArray.find(
    (c: React.ReactElement) => c.props && c.props.id
  ) as ReactElement;
  const targetId = childWithId ? childWithId.props.id : null;
  const sourceProps = getSourceProps({ id: targetId }, { storyStore });
  return {
    ...props, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: withSource === SourceState.OPEN,
  };
};

export const Preview: React.FunctionComponent<PreviewProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const previewProps = getPreviewProps(props, context);
      return <PurePreview {...previewProps}>{props.children}</PurePreview>;
    }}
  </DocsContext.Consumer>
);
