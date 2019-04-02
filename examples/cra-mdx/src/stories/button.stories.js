import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { docInfo } from './docInfo';

export const componentMeta = {
  title: 'Module|Button',
  decorators: [],
  parameters: { component: docInfo(Button) },
};

export const withText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
withText.title = 'with text';
