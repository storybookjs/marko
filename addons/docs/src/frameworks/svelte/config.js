/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/svelte';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docsContainer: DocsContainer,
  docs: DocsPage,
});
