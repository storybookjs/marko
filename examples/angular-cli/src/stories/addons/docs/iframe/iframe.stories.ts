import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addons/Docs/Iframe',
  component: Button,
  parameters: { docs: { iframeHeight: 120, inlineStories: true } },
};

export const Basic = (args) => ({
  props: args,
});
Basic.args = { text: 'Add 👾' };
