import React from 'react';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Addons/Docs/csf-with-mdx-docs',
  component: Button,
  includeStories: [], // or don't load this file at all
};

export const basic = () => <Button>Basic</Button>;
