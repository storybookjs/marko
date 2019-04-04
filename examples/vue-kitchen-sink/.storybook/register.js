import * as React from 'react';
import PropTypes from 'prop-types';
import addons, { types } from '@storybook/addons';
import { IFrame } from '@storybook/components';
import { Consumer } from '@storybook/api';

const baseUrl = 'iframe.html';

const Panel = ({ active }) => {
  if (!active) {
    return null;
  }
  return (
    <Consumer filter={({ state }) => state.storyId}>
      {storyId => (
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

Panel.propTypes = {
  active: PropTypes.bool.isRequired,
};

addons.register('docs', () => {
  addons.add('docs-panel', {
    type: types.TAB,
    title: 'Docs',
    route: ({ storyId }) => `/info/${storyId}`, // todo add type
    match: ({ viewMode }) => viewMode === 'info', // todo add type
    render: ({ active }) => <Panel active={active} />, // eslint-disable-line react/prop-types
  });
});
