import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export const componentMeta = {
  title: 'Module|Button',
  decorators: [],
};

export const withText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
withText.title = 'with text';
