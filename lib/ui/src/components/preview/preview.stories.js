import React from 'react';

import { Preview } from './preview';
import { previewProps } from './preview.mockdata';

export default {
  title: 'UI/Preview/Preview',
  component: Preview,
};

export const noTabs = () => <Preview {...previewProps} getElements={() => []} />;

export const withTabs = () => <Preview {...previewProps} />;
