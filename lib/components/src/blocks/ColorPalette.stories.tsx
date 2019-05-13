import React from 'react';
import { Color, ColorPalette } from './ColorPalette';

import { Content as DocsPageWrapper } from './DocsPage';

export const componentMeta = {
  title: 'Docs|ColorPalette',
  Component: ColorPalette,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const defaultStyle = () => (
  <ColorPalette>
    <Color
      title="theme.color.greyscale"
      subtitle="Some of the greys"
      colors={['#FFFFFF', '#F8F8F8', '#F3F3F3']}
    />
    <Color title="theme.color.primary" subtitle="Coral" colors={['#FF4785']} />
    <Color title="theme.color.secondary" subtitle="Ocean" colors={['#1EA7FD']} />
    <Color
      title="theme.color.positive"
      subtitle="Green"
      colors={[
        'rgba(102,191,60,1)',
        'rgba(102,191,60,.8)',
        'rgba(102,191,60,.6)',
        'rgba(102,191,60,.3)',
      ]}
    />
  </ColorPalette>
);
