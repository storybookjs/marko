import { Meta, Story } from '@storybook/angular/types-6-0';
import { DocButtonComponent, ISomeInterface } from './addons/docs/doc-button/doc-button.component';

export default {
  title: 'Addon/Controls',
  component: DocButtonComponent,
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

const someDataObject: ISomeInterface = {
  one: 'Hello world',
  two: true,
  three: ['One', 'Two', 'Three'],
};

export const Basic = Template.bind({});
Basic.args = { label: 'Args test', isDisabled: false, someDataObject };

export const Disabled = Template.bind({});
Disabled.args = { label: 'Disabled', isDisabled: true };

export const NoTemplate = () => ({
  props: { label: 'No template', isDisabled: false },
});
