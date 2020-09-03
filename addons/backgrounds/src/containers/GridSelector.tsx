import { document } from 'global';
import React, { FunctionComponent, memo, useMemo, useEffect } from 'react';

import { useAddonState, useParameter } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { logger } from '@storybook/client-logger';

import { ADDON_ID, GRID_PARAM_KEY } from '../constants';

export interface BackgroundGridParameters {
  cellSize: number;
}

export const GridSelector: FunctionComponent = memo(() => {
  const [isActive, setIsActive] = useAddonState<boolean>(`${ADDON_ID}/grid`);
  const { cellSize } = useParameter<BackgroundGridParameters>(GRID_PARAM_KEY, { cellSize: 20 });

  const gridStyles = useMemo(
    () => ({
      backgroundSize: [
        `${cellSize * 5}px ${cellSize * 5}px`,
        `${cellSize * 5}px ${cellSize * 5}px`,
        `${cellSize}px ${cellSize}px`,
        `${cellSize}px ${cellSize}px`,
      ].join(', '),
      backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
      backgroundBlendMode: 'difference',
      backgroundImage: [
        'linear-gradient(rgba(130, 130, 130, 0.5) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(130, 130, 130, 0.5) 1px, transparent 1px)',
        'linear-gradient(rgba(130, 130, 130, 0.25) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(130, 130, 130, 0.25) 1px, transparent 1px)',
      ].join(', '),
    }),
    [cellSize]
  );

  useEffect(() => {
    const preview = document.querySelector('#storybook-preview-iframe')?.contentDocument
      ?.body as HTMLElement;
    if (preview) {
      Object.keys(gridStyles).forEach((styleKey: string) => {
        // @ts-ignore ignoring this unfortunately seems to be the only way
        preview.style[styleKey] = isActive ? gridStyles[styleKey] : 'initial';
      });
    } else {
      logger.warn(`
        Backgrounds Addon: could not find the preview element to apply the grid on. 
        Please file an issue on github: https://github.com/storybookjs/storybook/issues/new/
      `);
    }
  }, [isActive]);

  return (
    <IconButton
      key="background"
      active={isActive}
      title="Change the background of the preview"
      onClick={() => setIsActive(!isActive)}
    >
      <Icons icon="grid" />
    </IconButton>
  );
});
