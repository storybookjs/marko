import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
  parameters: {
    component: Button,
  },
};

export const Story1 = () => <Button onClick={action('clicked')}>Hello Button</Button>;
Story1.storyName = 'with text';

export const Story2 = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
Story2.storyName = 'with some emoji';
