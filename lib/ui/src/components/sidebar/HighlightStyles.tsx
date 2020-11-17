import React, { FunctionComponent } from 'react';
import { Global } from '@storybook/theming';
import { Highlight } from './types';

export const HighlightStyles: FunctionComponent<Highlight> = ({ refId, itemId }) => (
  <Global
    styles={({ color }) => ({
      [`[data-ref-id="${refId}"][data-item-id="${itemId}"]:not([data-selected="true"])`]: {
        [`&[data-nodetype="component"], &[data-nodetype="group"]`]: {
          background: `${color.secondary}22`,
          '&:hover, &:focus': {
            background: `${color.secondary}22`,
          },
        },
        [`&[data-nodetype="story"], &[data-nodetype="document"]`]: {
          color: color.defaultText,
          background: `${color.secondary}22`,
          '&:hover, &:focus': { background: `${color.secondary}22` },
        },
      },
    })}
  />
);
