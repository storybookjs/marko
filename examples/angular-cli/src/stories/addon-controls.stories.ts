import { Story, Meta } from '@storybook/angular/types-6-0';
import { DocButtonComponent } from './doc-button/doc-button.component';

export default {
  title: 'Addon/Controls',
  component: DocButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { label: 'Args test', isDisabled: false };

export const Disabled = Template.bind({});
Disabled.args = { label: 'Disabled', isDisabled: true };
