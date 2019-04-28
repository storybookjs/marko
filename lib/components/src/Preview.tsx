import React from 'react';
import PropTypes from 'prop-types';

import { IFrame } from './IFrame';
import { DocsContext } from './DocsContext';

const baseUrl = 'iframe.html';

interface PreviewProps {
  id: string;
  height: string;
}

export const Preview: React.FunctionComponent<PreviewProps> = ({ id, height }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters }) => {
      const data = storyStore.fromId(id);
      const { inlineStories } = (parameters && parameters.options && parameters.options.docs) || {
        inlineStories: false,
      };
      if (!inlineStories) {
        return (
          <div style={{ width: '100%', height }}>
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

Preview.defaultProps = {
  height: '500px',
};
