import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
  component: Button,
};

export const Story1 = () => <Button onClick={action('clicked', { depth: 1 })}>Hello Button</Button>;
Story1.storyName = 'with text';

Story1.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' },
};

export const Story2 = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="yolo">
      😀 😎 👍 💯
    </span>
  </Button>
);
Story2.storyName = 'with some emoji';

Story2.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' },
};
