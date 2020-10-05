import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

const ButtonWithForwardRef = React.forwardRef(DocgenButton);

export default {
  title: 'Addons/Docs/ButtonWithForwardRef',
  component: ButtonWithForwardRef,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

export const displaysCorrectly = () => <ButtonWithForwardRef label="Hello forwardRef World" />;
displaysCorrectly.storyName = 'Displays components with forwardRef correctly';
