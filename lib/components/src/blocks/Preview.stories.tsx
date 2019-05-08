import React from 'react';
import { Preview, PreviewError } from './Preview';
import { Button } from '../Button/Button';

export const componentMeta = {
  title: 'Docs|Preview',
  Component: Preview,
};

export const error = () => <Preview error={PreviewError.NO_STORY} />;

const buttonFn = () => <Button>Hello Button</Button>;

export const inline = () => <Preview inline storyFn={buttonFn} title="hello button" />;
