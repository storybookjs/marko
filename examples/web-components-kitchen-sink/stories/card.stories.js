/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Demo Card',
  component: 'demo-wc-card',
};

export const Front = ({ backSide, header, rows }) =>
  html`
    <demo-wc-card .backSide="${backSide}" .header="${header}" .rows="${rows}"
      >A simple card</demo-wc-card
    >
  `;
Front.args = { backSide: false, header: undefined, rows: [] };

export const Back = Front.bind();
Back.args = { ...Front.args, backSide: true };

export const FrontOwnHeader = Front.bind();
FrontOwnHeader.args = { ...Front.args, header: 'My own Header' };

export const BackWithData = Front.bind();
BackWithData.args = {
  ...Back.args,
  rows: [
    { header: 'health', value: '200' },
    { header: 'mana', value: '100' },
  ],
};
