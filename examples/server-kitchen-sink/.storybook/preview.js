import { withLinks } from '@storybook/addon-links';

export const decorators = [withLinks];

const port = process.env.SERVER_PORT || 1337;

export const parameters = {
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
};
