import { moduleMetadata, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Core / Story host styles',
  decorators: [
    moduleMetadata({
      declarations: [Button],
    }),
  ],
};

export const TemplateStory: Story = () => ({
  template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
  props: {
    text: 'Button with custom styles',
    onClick: action('log'),
  },
  styles: [
    `
      storybook-button-component {
        background-color: yellow;
        padding: 25px;
      }
    `,
  ],
});

TemplateStory.storyName = 'With story template';

export const WithKnobsStory = () => ({
  template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
  props: {
    text: text('text', 'Button with custom styles'),
    onClick: action('log'),
  },
  styles: [
    `
  storybook-button-component {
    background-color: red;
    padding: 25px;
  }
`,
  ],
});

WithKnobsStory.storyName = 'With Knobs';
WithKnobsStory.decorators = [withKnobs];
