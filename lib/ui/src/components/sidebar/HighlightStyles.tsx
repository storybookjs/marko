import { transparentize } from 'polished';
import React, { FunctionComponent } from 'react';
import { Global } from '@storybook/theming';
import { Highlight } from './types';

export const HighlightStyles: FunctionComponent<Highlight> = ({ refId, itemId }) => (
  <Global
    styles={({ color }) => {
      const background = transparentize(0.85, color.secondary);
      return {
        [`[data-ref-id="${refId}"][data-item-id="${itemId}"]:not([data-selected="true"])`]: {
          [`&[data-nodetype="component"], &[data-nodetype="group"]`]: {
            background,
            '&:hover, &:focus': { background },
          },
          [`&[data-nodetype="story"], &[data-nodetype="document"]`]: {
            color: color.defaultText,
            background,
            '&:hover, &:focus': { background },
          },
        },
      };
    }}
  />
);
