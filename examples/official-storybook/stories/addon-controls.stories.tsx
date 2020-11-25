import React from 'react';
import Button from '../components/TsButton';

export default {
  title: 'Addons/Controls',
  component: Button,
  argTypes: {
    children: { control: 'text', name: 'Children' },
    type: { control: 'text', name: 'Type' },
    somethingElse: { control: 'object', name: 'Something Else' },
  },
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'basic',
  somethingElse: { a: 2 },
};

export const Action = Template.bind({});
Action.args = {
  children: 'hmmm',
  type: 'action',
  somethingElse: { a: 4 },
};

export const CustomControls = Template.bind({});
CustomControls.argTypes = {
  children: { table: { disable: true } },
  type: { control: { disable: true } },
};

export const NoArgs = () => <Button>no args</Button>;

const hasCycle: any = {};
hasCycle.cycle = hasCycle;

export const CyclicArgs = Template.bind({});
CyclicArgs.args = {
  hasCycle,
};
CyclicArgs.parameters = {
  chromatic: { disable: true },
};
