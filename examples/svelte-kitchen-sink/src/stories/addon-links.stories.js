import { linkTo } from '@storybook/addon-links';

import ActionLinkView from './views/ActionLinkView.svelte';

export default {
  title: 'Addon/Links',
};

export const GoToWelcomeView = () => ({
  Component: ActionLinkView,
  on: {
    click: linkTo('Welcome'),
  },
});

GoToWelcomeView.storyName = 'Go to welcome view';
