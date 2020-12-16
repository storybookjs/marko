import { linkTo } from '@storybook/addon-links';
import { Button } from '@storybook/angular/demo';

export default {
  component: Button,
  title: 'Addon/Links',
};

export const ButtonWithLinkToAnotherStory = () => ({
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
