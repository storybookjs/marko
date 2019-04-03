import React from 'react';
import PropTypes from 'prop-types';

import { DocsContext } from './DocsContext';

export const Preview = ({ id }) => (
  <DocsContext.Consumer>
    {({ storyStore }) => {
      const data = storyStore.fromId(id);
      return <div aria-labelledby={data.name}>{data.getDecorated()()}</div>;
    }}
  </DocsContext.Consumer>
);

Preview.propTypes = {
  id: PropTypes.string.isRequired,
};
