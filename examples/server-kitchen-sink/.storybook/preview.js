import { addParameters, addDecorator } from '@storybook/server';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);

const port = process.env.SERVER_PORT || 1337;

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    showRoots: true,
  },
  docs: {
    iframeHeight: '200px',
  },
  server: {
    url: `http://localhost:${port}/storybook_preview`,
  },
});
