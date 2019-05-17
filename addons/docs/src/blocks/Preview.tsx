import React, { useState, ReactElement, ReactNodeArray } from 'react';
import {
  ActionBar,
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
} from '@storybook/components';
import { Story } from './Story';
import { Source } from './Source';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

interface PreviewSourceProps {
  source?: SourceState;
}

type PreviewProps = PurePreviewProps & {
  source?: SourceState;
};

export const Preview: React.FunctionComponent<PreviewProps> = ({
  children,
  source = SourceState.OPEN,
  ...props
}) => {
  const [sourceState, setSourceState] = React.useState(source);

  let actionItem;
  let childWithId: React.ReactElement = null;
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  console.log('children', children);
  switch (sourceState) {
    case SourceState.OPEN:
      actionItem = {
        title: 'hide code',
        onClick: () => setSourceState(SourceState.CLOSED),
      };
      // FIXME: support multiple children
      childWithId = childArray.find(
        (c: React.ReactElement) => c.props && c.props.id
      ) as ReactElement;
      break;
    case SourceState.CLOSED:
      actionItem = {
        title: 'show code',
        onClick: () => setSourceState(SourceState.OPEN),
      };
      break;
    case SourceState.NONE:
    default:
      break;
  }

  const actionChild = actionItem ? <ActionBar actionItems={[actionItem]} /> : null;
  const sourceChild = childWithId ? <Source id={childWithId.props.id} /> : null;
  return (
    <PurePreview {...props}>
      {children || <Story />}
      {sourceChild}
      {actionChild}
    </PurePreview>
  );
};
