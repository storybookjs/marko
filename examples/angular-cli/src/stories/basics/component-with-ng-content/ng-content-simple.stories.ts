import { Component } from '@angular/core';

import { Story, Meta } from '@storybook/angular/types-6-0';

@Component({
  selector: 'storybook-with-ng-content',
  template: `Content value:
    <div style="color: #1e88e5;"><ng-content></ng-content></div>`,
})
class WithNgContentComponent {}

export default {
  title: 'Basics / Component / With ng-content / Simple',
  component: WithNgContentComponent,
} as Meta;

export const OnlyComponent: Story = () => ({});

export const Default: Story = () => ({
  template: `<storybook-with-ng-content><h1>This is rendered in ng-content</h1></storybook-with-ng-content>`,
});

export const WithDynamicContentAndArgs: Story = (args) => ({
  template: `<storybook-with-ng-content><h1>${args.content}</h1></storybook-with-ng-content>`,
});
WithDynamicContentAndArgs.argTypes = {
  content: { control: 'text' },
};
WithDynamicContentAndArgs.args = { content: 'Default content' };
