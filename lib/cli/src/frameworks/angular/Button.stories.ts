import { action } from '@storybook/addon-actions';
import Button from './button.component';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args: Button) => ({
  component: Button,
  props: args,
});

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
