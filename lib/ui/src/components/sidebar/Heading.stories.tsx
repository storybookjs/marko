import React from 'react';
import { themes, ThemeProvider, ensure } from '@storybook/theming';
import { action } from '@storybook/addon-actions';

import { Heading } from './Heading';

const { light } = themes;
const theme = ensure(light);

export default {
  component: Heading,
  title: 'UI/Sidebar/Heading',
  decorators: [
    (storyFn: any) => (
      <div
        style={{
          maxWidth: '240px',
        }}
      >
        {storyFn()}
      </div>
    ),
  ],
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'fullscreen',
  },
};

const menuItems = [
  { title: 'Menu Item 1', onClick: action('onActivateMenuItem'), id: '1' },
  { title: 'Menu Item 2', onClick: action('onActivateMenuItem'), id: '2' },
  { title: 'Menu Item 3', onClick: action('onActivateMenuItem'), id: '3' },
];

export const menuHighlighted = () => <Heading menuHighlighted menu={menuItems} />;

export const standardData = { menu: menuItems };

export const standard = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: undefined,
        url: undefined,
        image: undefined,
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);

export const standardNoLink = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: undefined,
        url: null,
        image: undefined,
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);

export const linkAndText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title',
        url: 'https://example.com',
        image: null,
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);

export const onlyText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title',
        url: null,
        image: null,
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);

export const longText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title is way to long to actually fit',
        url: null,
        image: null,
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);

export const customBrandImage = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My Title',
        url: 'https://example.com',
        image: 'https://via.placeholder.com/150x22',
      },
    }}
  >
    <Heading menu={menuItems} />
  </ThemeProvider>
);
