import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/a11y',
  parameters: {
    options: { selectedPanel: '@storybook/a11y/panel' },
  },
};

export const Default = () => hbs`<button></button>`;
export const Label = () => hbs`<button>Testing the a11y addon</button>`;
export const Disabled = () => hbs`<button disabled>Testing the a11y addon</button>`;

export const InvalidContrast = () =>
  hbs`<button style="color: black; background-color: brown;">Testing the a11y addon</button>`;

InvalidContrast.storyName = 'Invalid contrast';
