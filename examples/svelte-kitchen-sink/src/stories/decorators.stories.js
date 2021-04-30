import { setContext } from 'svelte';
import { action } from '@storybook/addon-actions';
import Context from '../components/Context.svelte';
import BorderDecorator from './BorderDecorator.svelte';

export default {
  title: 'Decorators',
  component: Context,
  decorators: [
    () => BorderDecorator,
    () => ({ Component: BorderDecorator, props: { color: 'blue' } }),
  ],
};

export const Decorators = () => ({
  on: {
    click: action('I am logging in the actions tab'),
  },
});
Decorators.decorators = [
  () => {
    setContext('storybook/test', 'setted from decorator');
  },
];
