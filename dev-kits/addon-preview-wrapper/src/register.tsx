import React, { FunctionComponent } from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID } from './constants';

const PreviewWrapper: FunctionComponent<{}> = (p) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      boxShadow: 'inset 0 0 10px black',
    }}
  >
    {p.children}
  </div>
);

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'edit page',
    type: types.PREVIEW,
    render: PreviewWrapper as any,
  });
});
