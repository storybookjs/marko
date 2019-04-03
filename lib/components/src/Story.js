import React from 'react';
import PropTypes from 'prop-types';
import { toId } from '@storybook/router';

import { DocsContext } from './DocsContext';

export const Story = ({ name, children }) => (
  <DocsContext.Consumer>
    {({ storyStore, selectedKind }) => {
      let contents = children;
      if (storyStore) {
        const data = storyStore.fromId(toId(selectedKind, name));
        contents = data.getDecorated()();
      }
      return <div aria-labelledby={name}>{contents}</div>;
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  children: null,
  name: null,
};

Story.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};
