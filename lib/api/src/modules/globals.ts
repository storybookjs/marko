import { SET_STORIES, UPDATE_GLOBALS, GLOBALS_UPDATED } from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

import { Args, ModuleFn } from '../index';
import { SetStoriesPayloadV2 } from '../lib/stories';
import { getSourceType } from './refs';

export interface SubState {
  globals: Args;
}

export interface SubAPI {
  updateGlobals: (newGlobals: Args) => void;
}

export const init: ModuleFn = ({ store, fullAPI }) => {
  const api: SubAPI = {
    updateGlobals(newGlobals) {
      // Only emit the message to the local ref
      fullAPI.emit(UPDATE_GLOBALS, {
        globals: newGlobals,
        options: {
          target: 'storybook-preview-iframe',
        },
      });
    },
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globals: {},
  };

  const initModule = () => {
    fullAPI.on(GLOBALS_UPDATED, function handleGlobalsUpdated({ globals }: { globals: Args }) {
      const { source }: { source: string } = this;
      const [sourceType] = getSourceType(source);

      switch (sourceType) {
        case 'local': {
          store.setState({ globals });
          break;
        }
        case 'external': {
          logger.warn(
            'received a GLOBALS_UPDATED from a non-local ref. This is not currently supported.'
          );
          break;
        }
        default: {
          logger.warn('received a SET_STORIES frame that was not configured as a ref');
        }
      }
    });
    fullAPI.on(SET_STORIES, function handleSetStories({ globals }: SetStoriesPayloadV2) {
      const { source }: { source: string } = this;
      const [sourceType] = getSourceType(source);

      switch (sourceType) {
        case 'local': {
          store.setState({ globals });
          break;
        }
        case 'external': {
          if (Object.keys(globals).length > 0) {
            logger.warn('received globals from a non-local ref. This is not currently supported.');
          }
          break;
        }
        default: {
          // This is already going to be warned about in stories.ts
        }
      }
    });
  };

  return {
    api,
    state,
    init: initModule,
  };
};
