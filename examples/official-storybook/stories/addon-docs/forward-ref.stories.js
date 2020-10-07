import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

export default {
  title: 'Addons/Docs/ForwardRef',
  component: ForwardedButton,
  parameters: {
    chromatic: { disable: true },
    docs: { source: { type: 'dynamic' } },
  },
};

const ForwardedButton = React.forwardRef(function ForwardedButton(props = { label: '' }, ref) {
  return <DocgenButton ref={ref} {...props} />;
});
export const DisplaysCorrectly = () => <ForwardedButton label="hello" />;
DisplaysCorrectly.storyName = 'Displays forwarded ref components correctly (default props)';

const ForwardedDestructuredButton = React.forwardRef(function ForwardedDestructuredButton(
  // eslint-disable-next-line react/prop-types
  { label = '', ...props },
  ref
) {
  return <DocgenButton ref={ref} label={label} {...props} />;
});
export const AlsoDisplaysCorrectly = () => <ForwardedDestructuredButton label="hello" />;
AlsoDisplaysCorrectly.storyName =
  'Displays forwarded ref components correctly (destructured props)';
