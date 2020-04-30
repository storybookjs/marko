import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import { Search } from './Search';

export default {
  component: Search,
  title: 'UI/Sidebar/Search',
  decorators: [(storyFn: any) => <div style={{ width: '240px' }}>{storyFn()}</div>],
};

const actions = makeActions('onChange');
const pureActions = { ...actions, ...makeActions('onSetFocussed') };

export const simple = () => <Search {...actions} />;

export const focussed = () => <Search defaultFocussed {...pureActions} />;

export const filledIn = () => <Search defaultValue="Searchstring" {...pureActions} />;
