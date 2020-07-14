/** @jsx h */
import { h } from 'preact';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
  onClick: action('onClick'),
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
  onClick: action('onClick'),
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
  onClick: action('onClick'),
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
  onClick: action('onClick'),
};
