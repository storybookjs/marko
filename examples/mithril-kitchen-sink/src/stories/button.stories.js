import m from 'mithril';

import { action } from '@storybook/addon-actions';

import Button from '../Button';

export default {
  title: 'Button',
  parameters: {
    component: Button,
  },
};

export const Story1 = () => ({
  view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
});
Story1.storyName = 'with text';

export const Story2 = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});
Story2.storyName = 'with some emoji';
