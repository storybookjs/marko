import { Story, Meta } from '@storybook/angular/types-6-0';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addon/Issues/12009 unknown component',
  component: Button,
  parameters: { docs: { iframeHeight: 120 } },
} as Meta;

const Template: Story = (args) => ({
  component: Button,
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { text: 'Unknown component' };
