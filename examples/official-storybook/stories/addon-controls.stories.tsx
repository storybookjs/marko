import React from 'react';
import Button from '../components/TsButton';

export default {
  title: 'Addons/Controls',
  component: Button,
};

const Story = (args) => <Button {...args} />;

export const Basic = Story.bind({});
Basic.args = {
  children: 'basic',
};

export const Action = Story.bind({});
Action.args = {
  children: 'hmmm',
  type: 'action',
};

export const CustomControls = Story.bind({});
CustomControls.argTypes = {
  children: { table: { disable: true } },
  type: { control: { disable: true } },
};
