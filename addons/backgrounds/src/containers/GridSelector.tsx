import React, { FunctionComponent, memo } from 'react';

import { useGlobals, useParameter } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';

export const GridSelector: FunctionComponent = memo(() => {
  const [globals, updateGlobals] = useGlobals();

  const { disable } = useParameter(BACKGROUNDS_PARAM_KEY, { disable: true });

  if (disable) {
    return null;
  }

  const isActive = globals[BACKGROUNDS_PARAM_KEY]?.grid || false;

  return (
    <IconButton
      key="background"
      active={isActive}
      title="Change the background of the preview"
      onClick={() => updateGlobals({ [BACKGROUNDS_PARAM_KEY]: { grid: !isActive } })}
    >
      <Icons icon="grid" />
    </IconButton>
  );
});
