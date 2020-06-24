import React, { Component, Fragment, ReactElement } from 'react';
import memoize from 'memoizerific';

import { Combo, Consumer, API } from '@storybook/api';
import { Global, Theme } from '@storybook/theming';
import { logger } from '@storybook/client-logger';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY, EVENTS } from '../constants';
import { ColorIcon } from '../components/ColorIcon';

interface GlobalState {
  name: string | undefined;
  selected: string | undefined;
}

interface Props {
  api: API;
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
  selectedBackground: string | null;
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
  backgrounds: Background[] = [],
  currentSelectedValue: string,
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

const getBackgroundsConfig = ({ api, state }: Combo): BackgroundsConfig => {
  const backgroundsParameter = api.getCurrentParameter<BackgroundsParameter>(BACKGROUNDS_PARAM_KEY);
  const selectedBackgroundValue = state.addons[BACKGROUNDS_PARAM_KEY] || null;

  if (Array.isArray(backgroundsParameter)) {
    logger.warn(
      'Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md'
    );
  }

  const isBackgroundsEmpty = !backgroundsParameter?.values?.length;
  if (backgroundsParameter?.disable || isBackgroundsEmpty) {
    // other null properties are necessary to keep the same return shape for Consumer memoization
    return {
      disable: true,
      backgrounds: null,
      selectedBackground: null,
      defaultBackgroundName: null,
    };
  }

  return {
    disable: false,
    backgrounds: backgroundsParameter?.values,
    selectedBackground: selectedBackgroundValue,
    defaultBackgroundName: backgroundsParameter?.default,
  };
};

export class BackgroundSelector extends Component<Props> {
  change = ({ selected, name }: GlobalState) => {
    const { api } = this.props;
    if (typeof selected === 'string') {
      api.setAddonState<string>(BACKGROUNDS_PARAM_KEY, selected);
    }
    api.emit(EVENTS.UPDATE, { selected, name });
  };

  render() {
    return (
      <Consumer filter={getBackgroundsConfig}>
        {({
          disable,
          backgrounds,
          selectedBackground,
          defaultBackgroundName,
        }: BackgroundsConfig) => {
          if (disable) {
            return null;
          }

          const selectedBackgroundColor = getSelectedBackgroundColor(
            backgrounds,
            selectedBackground,
            defaultBackgroundName
          );

          return (
            <Fragment>
              {selectedBackgroundColor ? (
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
              ) : null}
              <WithTooltip
                placement="top"
                trigger="click"
                closeOnClick
                tooltip={({ onHide }) => (
                  <TooltipLinkList
                    links={getDisplayedItems(backgrounds, selectedBackgroundColor, (i) => {
                      this.change(i);
                      onHide();
                    })}
                  />
                )}
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
        }}
      </Consumer>
    );
  }
}
