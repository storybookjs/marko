import { addParameters, addDecorator } from '@storybook/server';
import { withLinks } from '@storybook/addon-links';

addDecorator(withLinks);

const port = process.env.SERVER_PORT || 1337;

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  docs: {
    iframeHeight: '200px',
  },
  server: {
    url: `http://localhost:${port}/storybook_preview`,
  },
});
