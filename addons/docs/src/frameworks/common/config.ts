import { addParameters } from '@storybook/client-api';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});
