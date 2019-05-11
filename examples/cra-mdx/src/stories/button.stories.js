import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export const componentMeta = {
  title: 'Module|Button',
  decorators: [],
  parameters: { component: Button },
};

export const withText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
withText.title = 'with text';

export const empty = () => <Button onClick={action('clicked')}>???</Button>;
