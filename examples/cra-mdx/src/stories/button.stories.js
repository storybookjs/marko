import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Module|Button',
  decorators: [],
  parameters: {
    componentDescription: 'The button to end all buttons', // FIXME
    component: Button,
    notes: 'button notes',
  },
};

export const withText = () => <Button onClick={action('clicked')}>Hello Button</Button>;
withText.title = 'with text';
withText.parameters = { notes: 'local notes' };

export const empty = () => <Button onClick={action('clicked')}>???</Button>;
empty.parameters = { primary: true };

export const another = () => <Button onClick={action('clicked')}>Another</Button>;
