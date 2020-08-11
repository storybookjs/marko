import { Story, Meta } from '@storybook/angular/types-6-0';
import { ButtonComponent } from './doc-button/doc-button.component';

export default {
  title: 'Addon/Controls',
  component: ButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
} as Meta;

const Template: Story = (args) => ({
  component: ButtonComponent,
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { label: 'Args test', isDisabled: false };

export const Disabled = Template.bind({});
Disabled.args = { label: 'Disabled', isDisabled: true };
