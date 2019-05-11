import React from 'react';
import { EmptyBlock } from './EmptyBlock';

import { Wrapper as DocsPageWrapper } from './DocsPage';

export const componentMeta = {
  title: 'Docs|EmptyBlock',
  Component: EmptyBlock,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const error = () => <EmptyBlock>Generic error message</EmptyBlock>;
