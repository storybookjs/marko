import React from 'react';

import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';
import mdx from './welcome.stories.mdx';

storiesOf('Classic|Welcome', module).add(
  'to Storybook',
  () => <Welcome showApp={linkTo('Button')} />,
  {
    component: Welcome,
    docs: mdx && mdx.parameters && mdx.parameters.docs,
  }
);
