import React from 'react';
import { action } from '@storybook/addon-actions';
import DocgenButton from './DocgenButton';

export const componentMeta = {
  title: 'Module|DocgenButton',
  decorators: [],
  parameters: { component: DocgenButton },
};

export const withText = () => <DocgenButton onClick={action('clicked')} label="Hello Button" />;
withText.title = 'with text';
