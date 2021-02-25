import { Story, Meta } from '@storybook/angular';
import { Welcome } from '@storybook/angular/demo';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Welcome/ To Storybook',
} as Meta;

export const toStorybook: Story = () => ({
  component: Welcome,
  props: {
    showApp: linkTo('Button'),
  },
});
