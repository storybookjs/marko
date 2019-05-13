import React from 'react';
import { Preview, PreviewError } from './Preview';

import { Content as DocsPageWrapper } from './DocsPage';
import { Button } from '../Button/Button';

export const componentMeta = {
  title: 'Docs|Preview',
  Component: Preview,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const error = () => <Preview error={PreviewError.NO_STORY} />;

const buttonFn = () => <Button secondary>Hello Button</Button>;

export const inline = () => <Preview inline storyFn={buttonFn} title="hello button" />;
