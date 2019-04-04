import React from 'react';
import PropTypes from 'prop-types';

import { IFrame } from './IFrame';
import { DocsContext } from './DocsContext';

const baseUrl = 'iframe.html';

export const Preview = ({ id }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters }) => {
      const data = storyStore.fromId(id);
      const { inlineStories } = (parameters && parameters.options && parameters.options.docs) || {};
      if (!inlineStories) {
        return (
          <div style={{ width: '490px', height: '400px' }}>
            <IFrame
              key="iframe"
              id={`storybook-preview-${id}`}
              title={data.selectedStory}
              src={`${baseUrl}?id=${id}`}
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
      return <div aria-labelledby={data.name}>{data.getDecorated()()}</div>;
    }}
  </DocsContext.Consumer>
);

Preview.propTypes = {
  id: PropTypes.string.isRequired,
};
