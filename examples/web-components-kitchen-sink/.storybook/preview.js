/* global window */

import { addParameters, setCustomElements } from '@storybook/web-components';

import customElements from '../custom-elements.json';

setCustomElements(customElements);

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
});
