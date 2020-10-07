import React from 'react';
import { MemoButton } from '../../components/MemoButton';

export default {
  title: 'Addons/Docs/Memo',
  component: MemoButton,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

export const displaysCorrectly = () => <MemoButton label="Hello memo World" />;
displaysCorrectly.storyName = 'Displays components with memo correctly';
