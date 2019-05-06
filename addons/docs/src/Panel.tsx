import React, { ReactElement, Component, Fragment, ReactNode } from 'react';
import { Consumer, Combo } from '@storybook/api';
import { IFrame } from './blocks';

const baseUrl = 'iframe.html';

interface Props {
  active: boolean;
}
const mapper = ({ state }: Combo): { storyId: string } => ({ storyId: state.storyId });

const DocsPanel = ({ active }: Props) => {
  if (!active) {
    return null;
  }
  return (
    <Consumer filter={mapper}>
      {({ storyId }: { storyId: string }) => (
        <IFrame
          key="iframe"
          id="storybook-preview-iframe"
          title="docs"
          src={`${baseUrl}?id=${storyId}&docs=true`}
          allowFullScreen
          scale={1}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            border: '0 none',
          }}
        />
      )}
    </Consumer>
  );
};

export default DocsPanel;
