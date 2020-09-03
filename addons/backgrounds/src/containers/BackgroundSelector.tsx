import { document } from 'global';
import React, {
  FunctionComponent,
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import memoize from 'memoizerific';

import { useAddonState, useParameter } from '@storybook/api';
import { Global, Theme } from '@storybook/theming';
import { logger } from '@storybook/client-logger';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';
import { ColorIcon } from '../components/ColorIcon';

interface GlobalState {
  name: string | undefined;
  selected: string | undefined;
}

interface BackgroundSelectorItem {
  id: string;
  title: string;
  onClick: () => void;
  value: string;
  right?: ReactElement;
}

interface Background {
  name: string;
  value: string;
}

interface BackgroundsParameter {
  default?: string;
  disable?: boolean;
  values: Background[];
}

interface BackgroundsConfig {
  backgrounds: Background[] | null;
  selectedBackgroundName: string | null;
  defaultBackgroundName: string | null;
  disable: boolean;
}

const iframeId = 'storybook-preview-iframe';

const createBackgroundSelectorItem = memoize(1000)(
  (
    id: string,
    name: string,
    value: string,
    hasSwatch: boolean,
    change: (arg: { selected: string; name: string }) => void
  ): BackgroundSelectorItem => ({
    id: id || name,
    title: name,
    onClick: () => {
      change({ selected: value, name });
    },
    value,
    right: hasSwatch ? <ColorIcon background={value} /> : undefined,
  })
);

const getDisplayedItems = memoize(10)(
  (
    backgrounds: Background[],
    selectedBackgroundColor: string | null,
    change: (arg: { selected: string; name: string }) => void
  ) => {
    const backgroundSelectorItems = backgrounds.map(({ name, value }) =>
      createBackgroundSelectorItem(null, name, value, true, change)
    );

    if (selectedBackgroundColor !== 'transparent') {
      return [
        createBackgroundSelectorItem('reset', 'Clear background', 'transparent', null, change),
        ...backgroundSelectorItems,
      ];
    }

    return backgroundSelectorItems;
  }
);

const getSelectedBackgroundColor = (
  currentSelectedValue: string,
  backgrounds: Background[] = [],
  defaultName: string
): string => {
  if (currentSelectedValue === 'transparent') {
    return 'transparent';
  }

  if (backgrounds.find((background) => background.value === currentSelectedValue)) {
    return currentSelectedValue;
  }

  const defaultBackground = backgrounds.find((background) => background.name === defaultName);
  if (defaultBackground) {
    return defaultBackground.value;
  }

  if (defaultName) {
    const availableColors = backgrounds.map((background) => background.name).join(', ');
    logger.warn(
      `Backgrounds Addon: could not find the default color "${defaultName}".
      These are the available colors for your story based on your configuration: ${availableColors}`
    );
  }

  return 'transparent';
};

const DEFAULT_BACKGROUNDS_CONFIG: BackgroundsParameter = {
  default: null,
  disable: true,
  values: [],
};

export const BackgroundSelector: FunctionComponent = () => {
  const [previousBackgroundOverride, setPreviousBackgroundOverride] = useState('transparent');

  const backgroundsConfig = useParameter<BackgroundsParameter>(
    BACKGROUNDS_PARAM_KEY,
    DEFAULT_BACKGROUNDS_CONFIG
  );

  const [selectedBackgroundName, setSelectedBackgroundName] = useAddonState<string>(
    BACKGROUNDS_PARAM_KEY,
    'transparent'
  );

  // Solution 1: override the background of the body programmatically
  useEffect(() => {
    const preview = document.querySelector('#storybook-preview-iframe')?.contentDocument
      ?.body as HTMLElement;
    const currentBackgroundOverride = preview.style.backgroundColor;
    if (!currentBackgroundOverride) {
      return;
    }

    const isAddonDisabled = selectedBackgroundName === 'transparent';

    if (isAddonDisabled) {
      preview.style.backgroundColor = previousBackgroundOverride;
    } else {
      // This will always store the latest background color override in case users have dynamic theme
      if (currentBackgroundOverride !== 'transparent') {
        setPreviousBackgroundOverride(preview.style.backgroundColor);
      }

      preview.style.backgroundColor = 'transparent';
    }
  }, [selectedBackgroundName]);

  // Solution 2: Add a classname in base-preview-head with transparent !important
  // useEffect(() => {
  //   const preview = document.querySelector('#storybook-preview-iframe')?.contentDocument
  //     ?.body as HTMLElement;

  //   const isAddonDisabled = selectedBackgroundName === 'transparent';

  //   if (isAddonDisabled) {
  //     preview.classList.remove('sb-bg-transparent');
  //   } else {
  //     preview.classList.add('sb-bg-transparent');
  //   }
  // }, [selectedBackgroundName]);

  const selectedBackgroundColor = useMemo(
    () =>
      getSelectedBackgroundColor(
        selectedBackgroundName,
        backgroundsConfig.values,
        backgroundsConfig.default
      ),
    [selectedBackgroundName]
  );

  if (Array.isArray(backgroundsConfig)) {
    logger.warn(
      'Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md'
    );
  }

  if (backgroundsConfig.disable) {
    return null;
  }

  const onBackgroundChange = ({ selected, name }: GlobalState) => {
    if (typeof selected === 'string') {
      setSelectedBackgroundName(selected);
    }
  };

  return (
    <Fragment>
      {selectedBackgroundColor && (
        <Global
          styles={(theme: Theme) => ({
            [`#${iframeId}`]: {
              background:
                selectedBackgroundColor === 'transparent'
                  ? theme.background.content
                  : selectedBackgroundColor,
            },
          })}
        />
      )}
      <WithTooltip
        placement="top"
        trigger="click"
        closeOnClick
        tooltip={({ onHide }) => {
          return (
            <TooltipLinkList
              links={getDisplayedItems(
                backgroundsConfig.values,
                selectedBackgroundColor,
                (item) => {
                  onBackgroundChange(item);
                  onHide();
                }
              )}
            />
          );
        }}
      >
        <IconButton
          key="background"
          title="Change the background of the preview"
          active={selectedBackgroundColor !== 'transparent'}
        >
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>
    </Fragment>
  );
};
