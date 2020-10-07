import React from 'react';
import { ForwardRefButtonInnerPropTypes } from '../../components/ForwardRefButton';

export default {
  title: 'Addons/Docs/ForwardRefInnerPropTypes',
  component: ForwardRefButtonInnerPropTypes,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

export const DisplaysCorrectly = () => <ForwardRefButtonInnerPropTypes label="hello" />;
DisplaysCorrectly.storyName =
  'Displays forward ref component w/ inner propTypes correctly w/o args';
