import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

const ButtonWithMemo = React.memo(DocgenButton);

export default {
  title: 'Addons/Docs/Memo',
  component: ButtonWithMemo,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

export const displaysCorrectly = () => <ButtonWithMemo label="Hello memo World" />;
displaysCorrectly.storyName = 'Displays components with memo correctly';
