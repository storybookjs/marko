import React from 'react';

import { DecoratorFn } from '@storybook/react';
import SettingsFooter from './SettingsFooter';

export default {
  component: SettingsFooter,
  title: 'UI/Settings/SettingsFooter',
  decorators: [
    ((StoryFn, c) => (
      <div style={{ width: '600px', margin: '2rem auto' }}>
        <StoryFn {...c} />
      </div>
    )) as DecoratorFn,
  ],
};

export const basic = () => <SettingsFooter />;
