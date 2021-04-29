import { Story, Meta } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Legacy / Component in Story',
} as Meta;

export const Basic: Story = (args) => ({
  component: Button,
  props: args,
});
Basic.args = {
  text: 'Hello Button',
};
