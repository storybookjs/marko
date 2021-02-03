import { Story, Meta } from '@storybook/angular/types-6-0';
import { DocButtonComponent } from './addons/docs/doc-button/doc-button.component';

export default {
  title: 'Addon/Controls',
  component: DocButtonComponent,
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { label: 'Args test', isDisabled: false };

export const Disabled = Template.bind({});
Disabled.args = { label: 'Disabled', isDisabled: true };
