import React from 'react';
import PropTypes from 'prop-types';
import { toId } from '@storybook/router';

import { IFrame } from './IFrame';
import { DocsContext } from './DocsContext';

const baseUrl = 'iframe.html';

export const Story = ({ name, children, height }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters, selectedKind }) => {
      let contents = children;
      if (storyStore) {
        const storyId = toId(selectedKind, name);
        const { inlineStories } =
          (parameters && parameters.options && parameters.options.docs) || {};
        if (!inlineStories) {
          return (
            <div style={{ width: '100%', height }}>
              <IFrame
                key="iframe"
                id={`storybook-preview-${storyId}`}
                title={name}
                src={`${baseUrl}?id=${storyId}`}
                allowFullScreen
                scale={1}
                style={{
                  width: '100%',
                  height: '100%',
                  border: '0 none',
                }}
              />
            </div>
          );
        }
        const data = storyStore.fromId(storyId);
        contents = data.getDecorated()();
      }
      return <div aria-labelledby={name}>{contents}</div>;
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  height: '500px',
  children: null,
  name: null,
};

Story.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  height: PropTypes.string,
};
