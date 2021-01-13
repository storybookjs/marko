import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

export default {
  component: Button,
  title: 'Addon/Actions',
};

export const ActionOnly = () => ({
  props: {
    text: 'Action only',
    onClick: action('log 1'),
  },
});

ActionOnly.storyName = 'Action only';

export const ActionAndMethod = () => ({
  props: {
    text: 'Action and Method',
    onClick: (e) => {
      console.log(e);
      e.preventDefault();
      action('log2')(e.target);
    },
  },
});

ActionAndMethod.storyName = 'Action and method';
