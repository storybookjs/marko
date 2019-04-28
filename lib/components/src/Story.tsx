import React from 'react';
import PropTypes from 'prop-types';
import { toId } from '@storybook/router';

import { DocsContext } from './DocsContext';
import { Preview } from './Preview';

interface StoryProps {
  name: string;
  children: React.ReactElement;
  height: string;
}

export const Story: React.FunctionComponent<StoryProps> = ({ name, children, height }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters, selectedKind }) => {
      let contents = children;
      if (storyStore) {
        const { inlineStories } = (parameters && parameters.options && parameters.options.docs) || {
          inlineStories: false,
        };
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
