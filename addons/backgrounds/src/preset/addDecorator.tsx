import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';
import React, { useMemo, useEffect, useRef, useCallback } from 'react';

import { logger } from '@storybook/client-logger';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';

const deprecatedCellSizeWarning = deprecate(
  () => {},
  dedent`
    Backgrounds Addon: The cell size parameters has been changed.

    - parameters.grid.cellSize should now be parameters.backgrounds.gridSize
    See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#moved-grid-parameter
  `
);

export const withGrid = (StoryFn: any, context: any) => {
  const storyRef = useRef<HTMLDivElement>();
  const { globals, parameters } = context;
  const isActive = globals[BACKGROUNDS_PARAM_KEY]?.grid || false;

  let gridSize: number;
  if (parameters.grid?.cellSize) {
    gridSize = parameters.grid.cellSize;
    deprecatedCellSizeWarning();
  } else {
    gridSize = parameters[BACKGROUNDS_PARAM_KEY]?.gridSize;
  }

  const gridStyles = useMemo(
    () => ({
      backgroundSize: [
        `${gridSize * 5}px ${gridSize * 5}px`,
        `${gridSize * 5}px ${gridSize * 5}px`,
        `${gridSize}px ${gridSize}px`,
        `${gridSize}px ${gridSize}px`,
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
    [gridSize]
  );

  const applyGridStyles = useCallback(
    (targetElement) => {
      Object.keys(gridStyles).forEach((styleKey: string) => {
        // @ts-ignore ignoring this unfortunately seems to be the only way
        // eslint-disable-next-line no-param-reassign
        targetElement.style[styleKey] = isActive ? gridStyles[styleKey] : 'initial';
      });
    },
    [gridStyles]
  );

  useEffect(() => {
    if (storyRef?.current) {
      let targetElement;
      const docsWrapper = storyRef.current.closest('.docs-story');
      if (docsWrapper) {
        targetElement = docsWrapper;
      } else {
        const preview = storyRef.current.closest('.sb-show-main');
        targetElement = preview;
      }

      if (targetElement) {
        applyGridStyles(targetElement);
      } else {
        logger.warn(`
          Backgrounds Addon: could not find the element to apply the grid on. 
          Please file an issue on github: https://github.com/storybookjs/storybook/issues/new/
        `);
      }
    }
  }, [isActive, storyRef]);

  return (
    <>
      <StoryFn />
      <div ref={storyRef} />
    </>
  );
};

export const decorators = [withGrid];
