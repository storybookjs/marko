import React from 'react';
import { Story, StoryError } from './Story';
import { Content as DocsPageWrapper } from './DocsPage';
import { Button } from '../Button/Button';

export const componentMeta = {
  title: 'Docs|Story',
  Component: Story,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const error = () => <Story error={StoryError.NO_STORY} />;

const buttonFn = () => <Button secondary>Hello Button</Button>;

export const inline = () => <Story inline storyFn={buttonFn} title="hello button" />;
