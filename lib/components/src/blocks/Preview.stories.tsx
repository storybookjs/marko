import React from 'react';
import { Preview, PreviewError } from './Preview';
import { Button } from '../Button/Button';

export const componentMeta = {
  title: 'Docs|Preview',
  Component: Preview,
};

const errorProps = {
  error: PreviewError.NO_STORY,
};
export const error = () => <Preview {...errorProps} />;
error.props = errorProps;

const buttonFn = () => <Button>Hello Button</Button>;

const inlineButtonProps = {
  inline: true,
  storyFn: buttonFn,
  title: 'hello button',
};

export const inline = () => <Preview {...inlineButtonProps} />;
inline.props = inlineButtonProps;
