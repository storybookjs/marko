/** @jsx h */

import { h } from 'preact';

import Button from '../Button';

export default {
  title: 'Addons/Backgrounds',

  parameters: {
    backgrounds: {
      default: 'facebook',
      values: [
        { name: 'twitter', value: '#00aced' },
        { name: 'facebook', value: '#3b5998' },
      ],
    },
  },
};

export const Example1 = () => (
  <Button>You should be able to switch backgrounds for this story</Button>
);

Example1.story = {
  name: 'Example 1',
};

export const Example2 = () => <Button>This one too!</Button>;

Example2.story = {
  name: 'Example 2',
};
