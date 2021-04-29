import React from 'react';
import { ForwardRefButtonOuterPropTypes } from '../../components/ForwardRefButton';

export default {
  title: 'Addons/Docs/ForwardRefOuterPropTypes',
  component: ForwardRefButtonOuterPropTypes,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

export const DisplaysCorrectly = () => <ForwardRefButtonOuterPropTypes label="hello" />;
DisplaysCorrectly.storyName = 'Displays forward ref component w/ outer propTypes correctly';
