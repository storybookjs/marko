import { Button } from '@storybook/angular/demo';
import { Story, Meta } from '@storybook/angular';

export default {
  title: 'Core / Parameters / Layout',
  component: Button,
} as Meta;

export const Default: Story = () => ({
  props: { text: 'Button' },
});

export const Fullscreen: Story = () => ({
  template: `<div style="background-color: yellow;"><storybook-button-component text="Button"></storybook-button-component></div>`,
});
Fullscreen.parameters = { layout: 'fullscreen' };

export const Centered: Story = () => ({
  props: { text: 'Button' },
});
Centered.parameters = { layout: 'centered' };

export const Padded: Story = () => ({
  props: { text: 'Button' },
});
Padded.parameters = { layout: 'padded' };

export const None: Story = () => ({
  props: { text: 'Button' },
});
None.parameters = { layout: 'none' };
