/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Addons/Backgrounds',
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#eeeeee' },
        { name: 'dark', value: '#222222' },
      ],
    },
  },
};

export const Story1 = () => html`
  <demo-wc-card>You should be able to switch backgrounds for this story</demo-wc-card>
`;
Story1.storyName = 'story 1';

export const Story2 = () => html` <demo-wc-card back-side>This one too!</demo-wc-card> `;
Story2.storyName = 'story 2';
