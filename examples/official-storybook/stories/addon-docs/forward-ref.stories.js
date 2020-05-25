import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

export default {
  title: 'Addons|Docs/ForwardRef',
  component: ForwardedButton,
  parameters: { chromatic: { disable: true } },
};

const ForwardedButton = React.forwardRef((props = { label: '' }, ref) => (
  <DocgenButton ref={ref} {...props} />
));
export const DisplaysCorrectly = () => <ForwardedButton label="hello" />;
DisplaysCorrectly.story = { name: 'Displays forwarded ref components correctly (default props)' };

// eslint-disable-next-line react/prop-types
const ForwardedDestructuredButton = React.forwardRef(({ label = '', ...props }, ref) => (
  <DocgenButton ref={ref} label={label} {...props} />
));
export const AlsoDisplaysCorrectly = () => <ForwardedDestructuredButton label="hello" />;
AlsoDisplaysCorrectly.story = {
  name: 'Displays forwarded ref components correctly (destructured props)',
};
