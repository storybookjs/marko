import React from 'react';
import Button from '../../components/TsButton';

export default {
  title: 'Addons/Docs/Source',
  component: Button,
  argTypes: {
    children: { control: 'text' },
    type: { control: 'text' },
  },
  parameters: {
    chromatic: { disable: true },
  },
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'basic',
  somethingElse: { a: 2 },
};

export const NoArgs = () => <Button>no args</Button>;

export const ForceCodeSource = Template.bind({});
ForceCodeSource.args = { ...Basic.args };
ForceCodeSource.parameters = { docs: { source: { type: 'code' } } };

export const CustomSource = Template.bind({});
CustomSource.args = { ...Basic.args };
CustomSource.parameters = { docs: { source: { code: 'custom source' } } };
