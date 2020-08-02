import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Some really long story kind description',
};

export const Story1 = () => <Button onClick={action('clicked')}>Hello Button</Button>;
Story1.storyName = 'with text';
