import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

const ForwardedButton = React.forwardRef((props = { label: '' }, ref) => (
  <DocgenButton ref={ref} {...props} />
));

export default {
  title: 'Addons|Docs/ForwardRef',
  component: ForwardedButton,
  parameters: { chromatic: { disable: true } },
};

export const displaysCorrectly = () => <ForwardedButton label="hello" />;
displaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };
