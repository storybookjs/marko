// FIXME: svgr issue @igor-dv

import React from 'react';

import App from '../App';

export default {
  title: 'App',
  parameters: {
    layout: 'fullscreen',
  },
};

export const FullApp = () => <App />;

FullApp.story = {
  name: 'full app',
};
