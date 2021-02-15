import { Story, Meta } from '@storybook/angular/types-6-0';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Others / Issues / 12009 unknown component',
  component: Button,
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { text: 'Unknown component' };
