import { action } from '@storybook/addon-actions';

import Button from '../components/Button.svelte';

export default {
  title: 'Addon/Actions',
};

export const ActionOnComponentMethod = () => ({
  Component: Button,
  props: {
    text: 'Custom text',
  },
  on: {
    click: action('I am logging in the actions tab too'),
  },
});

ActionOnComponentMethod.storyName = 'Action on component method';
