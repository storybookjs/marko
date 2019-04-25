import React from 'react';
import PropTypes from 'prop-types';
import { toId } from '@storybook/router';

import { DocsContext } from './DocsContext';
import { Preview } from './Preview';

export const Story = ({ name, children, height }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters, selectedKind }) => {
      let contents = children;
      if (storyStore) {
        const { inlineStories } =
          (parameters && parameters.options && parameters.options.docs) || {};
        const id = toId(selectedKind, name);
        if (!inlineStories) {
          return <Preview {...{ id, height }} />;
        }
        const data = storyStore.fromId(id);
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
