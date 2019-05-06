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

export const Story: React.FunctionComponent<StoryProps> = ({ name, height }) => (
  <DocsContext.Consumer>
    {({ mdxKind }) => {
      const id = toId(mdxKind, name);
      return <Preview {...{ id, height }} />;
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  children: null,
  name: null,
};
