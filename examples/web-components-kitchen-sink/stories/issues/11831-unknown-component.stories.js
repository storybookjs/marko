/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../../demo-wc-card.js';

export default {
  title: 'Addons/Issues/11831 Unknown component',
  component: 'unknown-component',
};

const Template = ({ backSide, header, rows }) =>
  html`
    <demo-wc-card .backSide="${backSide}" .header="${header}" .rows="${rows}"
      >A simple card</demo-wc-card
    >
  `;

export const Front = Template.bind({});
Front.args = { backSide: false, header: undefined, rows: [] };
