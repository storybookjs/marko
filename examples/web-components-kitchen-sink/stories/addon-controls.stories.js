/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Addons/Controls',
  component: 'demo-wc-card',
};

const Template = ({ backSide, header, rows }) =>
  html`
    <demo-wc-card .backSide="${backSide}" .header="${header}" .rows="${rows}"
      >A simple card</demo-wc-card
    >
  `;

export const Front = Template.bind({});
Front.args = { backSide: false, header: undefined, rows: [] };

export const Back = Template.bind({});
Back.args = { ...Front.args, backSide: true };

export const FrontOwnHeader = Template.bind({});
FrontOwnHeader.args = { ...Front.args, header: 'My own Header' };

export const BackWithData = Template.bind({});
BackWithData.args = {
  ...Back.args,
  rows: [
    { header: 'health', value: '200' },
    { header: 'mana', value: '100' },
  ],
};
