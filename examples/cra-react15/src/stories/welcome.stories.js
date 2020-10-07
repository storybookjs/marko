import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

// Added deprecated setAddon tests
setAddon({
  aa() {
    console.log('aa');
  },
});

setAddon({
  bb() {
    console.log('bb');
  },
});

storiesOf('Welcome', module)
  .addParameters({
    component: Welcome,
  })
  .aa()
  .bb()
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
