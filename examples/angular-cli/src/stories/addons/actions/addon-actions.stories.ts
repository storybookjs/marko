import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

export default {
  component: Button,
  title: 'Addons/Actions',
} as Meta;

export const ComponentOutputWithEventEmitter: Story = () => ({
  props: {
    text: 'Button 🥁',
    onClick: action('On click'),
  },
});
ComponentOutputWithEventEmitter.storyName = 'Component Output with EventEmitter';

export const UseActionInMethod: Story = () => ({
  props: {
    text: 'Button 🥁',
    onClick: (e) => {
      console.log(e);
      e.preventDefault();
      action('Action name')(e.target, 'Another arg');
    },
  },
});
UseActionInMethod.storyName = 'Use action in method';

export const StoryTemplate: Story = () => ({
  template: `<button (click)="onClick($event)" (mouseover)="onOver()">Button</button>`,
  props: {
    onClick: action('On click'),
    onOver: action('On over'),
  },
});
StoryTemplate.storyName = 'Story with template';

export const ComponentOutputWithArgsTypes: Story = (args) => ({
  props: {
    text: 'Button 🥁',
    ...args,
  },
});
ComponentOutputWithArgsTypes.storyName = 'Component Output with ArgsTypes';
ComponentOutputWithArgsTypes.argTypes = { onClick: { action: 'On click' } };
